# Documentation du Processus de Coupon

## Vue d'ensemble

Le système de coupons permet aux utilisateurs autorisés de publier des codes promotionnels et à la communauté de les noter. Chaque vote génère une rémunération pour l'auteur du coupon.

## 📋 Résumé Rapide pour le Frontend

### Endpoints Principaux
- **Créer un coupon** : `POST /coupon` (nécessite `can_publish_coupons` ou `is_staff`)
- **Noter un coupon** : `POST /coupons/<coupon_id>/vote/` (nécessite `can_rate_coupons`)
- **Liste des coupons** : `GET /coupon` (avec pagination)

### Champs User à Vérifier
- `user.can_publish_coupons` → Afficher bouton "Créer un coupon"
- `user.can_rate_coupons` → Afficher boutons de notation (étoiles)
- `coupon.can_rate` → Vérifier si l'utilisateur peut noter ce coupon spécifique

### Logique Frontend
```javascript
// Publication
if (user.can_publish_coupons || user.is_staff) { /* autoriser */ }

// Notation
if (user.can_rate_coupons && coupon.can_rate) { /* autoriser */ }
```

---

## 🔑 Champs User pour le Frontend

### Informations Importantes

Le modèle `User` expose **trois champs spécifiques** que le frontend doit utiliser pour déterminer les permissions de l'utilisateur concernant les coupons :

| Champ | Type | Défaut | Description | Utilisation Frontend |
|-------|------|--------|-------------|---------------------|
| `can_publish_coupons` | Boolean | `false` | Permission de publier des coupons | Afficher/masquer le bouton "Créer un coupon" |
| `can_rate_coupons` | Boolean | `false` | Permission de noter des coupons | Afficher/masquer les boutons de notation (étoiles) |
| `coupon_points` | Decimal | `0.00` | Points gagnés (info) | Affichage informatif (optionnel) |

### Structure de Réponse User (Exemple)

**Endpoint** : `GET /auth/me` (ou l'endpoint utilisé pour récupérer les infos utilisateur)

```json
{
  "id": "uuid-user",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "is_staff": false,
  "can_publish_coupons": true,
  "can_rate_coupons": true,
  "coupon_points": 0.00
}
```

**⚠️ Important** : Assurez-vous que les champs `can_publish_coupons`, `can_rate_coupons` et `coupon_points` sont inclus dans le serializer `UserSerializer` ou `UserInfosSerializer` utilisé par l'endpoint qui retourne les informations utilisateur au frontend.

### Guide d'Utilisation Frontend

#### 1. Vérifier la Permission de Publication

```javascript
// Afficher le bouton "Créer un coupon" uniquement si :
if (user.can_publish_coupons || user.is_staff) {
  // Afficher le bouton
  // Autoriser l'accès à POST /coupon
} else {
  // Masquer le bouton ou afficher un message d'information
}
```

#### 2. Vérifier la Permission de Notation

```javascript
// Afficher les boutons de notation uniquement si :
if (user.can_rate_coupons && coupon.can_rate) {
  // Afficher les étoiles (1-5)
  // Autoriser l'accès à POST /coupons/{coupon_id}/rate/
} else {
  // Masquer les boutons ou afficher un message explicatif
}
```

**Note** : Le champ `can_rate` dans la réponse de `GET /coupon` combine déjà :
- La permission `can_rate_coupons` de l'utilisateur
- Le fait qu'il n'ait pas déjà voté pour ce coupon

#### 3. Gestion des Erreurs 403

Si l'utilisateur tente une action sans permission :

**Pour la publication :**
```javascript
// Message suggéré : "Vous n'avez pas la permission de publier des coupons. Contactez un administrateur."
```

**Pour la notation :**
```javascript
// Message suggéré : "Pour noter des coupons, vous devez avoir au moins 1 mois d'ancienneté et 15 000 FCFA de transactions acceptées."
```

---

## 1. Créer un Coupon

### Endpoint
```
POST /coupon
```

### Permissions
- **Authentification requise** : `IsAuthenticated`
- **Autorisation** : L'utilisateur doit être soit :
  - Un administrateur (`is_staff = True`)
  - Un utilisateur avec la permission `can_publish_coupons = True`

### Requête

**Headers :**
```
Authorization: Bearer <token_jwt>
Content-Type: application/json
```

**Body :**
```json
{
  "bet_app_id": "uuid-de-l-application",
  "code": "CODE_PROMO_123"
}
```

**Champs :**
- `bet_app_id` (requis) : UUID de l'application de paris (`AppName`)
- `code` (optionnel) : Code promotionnel du coupon

### Réponse

**Succès (201 Created) :**
```json
{
  "id": "uuid-du-coupon",
  "created_at": "2024-01-15T10:30:00Z",
  "code": "CODE_PROMO_123",
  "bet_app": {
    "id": "uuid-app",
    "name": "XBet",
    "public_name": "XBet"
  },
  "bet_app_id": "uuid-de-l-application",
  "author": "uuid-auteur",
  "author_name": "John Doe",
  "average_rating": 0.00,
  "total_ratings": 0,
  "user_rating": null,
  "can_rate": false
}
```

**Erreurs possibles :**
- `403 Forbidden` : L'utilisateur n'a pas la permission de publier des coupons
- `404 Not Found` : L'application (`bet_app_id`) n'existe pas
- `400 Bad Request` : Données invalides

### Processus interne

1. Vérification de la permission (`is_staff` ou `can_publish_coupons`)
2. Validation des données via `CouponSerializer`
3. Vérification de l'existence de l'application (`AppName`)
4. Création du coupon avec :
   - `author` = utilisateur connecté (`request.user`)
   - `bet_app` = application trouvée
   - Statistiques initialisées à 0 (`total_ratings`, `sum_ratings`, `average_rating`)

**Note** : Le champ `author` est en `read_only` dans le serializer. Il doit être défini explicitement lors de l'appel à `serializer.save()` ou via un signal Django.

---

## 2. Voter pour un Coupon (Like/Dislike)

### Endpoint
```
POST /coupons/<coupon_id>/vote/
```

### Permissions
- **Authentification requise** : `IsAuthenticated`
- **Autorisation** : L'utilisateur doit avoir `can_rate_coupons = True`
  - Cette permission est accordée automatiquement aux utilisateurs avec :
    - Au moins 1 mois d'ancienneté
    - Au moins 15 000 FCFA de transactions acceptées

### Description
Ce système remplace la notation par étoiles classique. Il s'agit d'un système de **Like / Dislike** (J'aime / Je n'aime pas) avec des règles spécifiques.

### Règles Business
1. **Un vote par jour et par auteur** : Un utilisateur ne peut voter pour qu'un seul coupon d'un même auteur par jour (24h).
2. **Pas de vote sur ses propres coupons** : Un auteur ne peut pas voter pour ses créations.
3. **Toggle (Bascule)** :
   - Si l'utilisateur envoie le **même vote** (ex: Like sur un coupon déjà Liké) → **Le vote est supprimé** (annulé).
   - Si l'utilisateur envoie le **vote opposé** (ex: Dislike sur un coupon Liké) → **Le vote est mis à jour** (devient Dislike).

### Requête

**Headers :**
```
Authorization: Bearer <token_jwt>
Content-Type: application/json
```

**Body :**
```json
{
  "vote_type": "like"
}
```
*Ou `dislike`*

**Champs :**
- `vote_type` (requis) : `"like"` ou `"dislike"`

### Réponse

**Succès (200 OK) :**
```json
{
  "message": "Vote like enregistré avec succès",
  "coupon": {
    "id": "uuid-coupon",
    "likes": 15,
    "dislikes": 2,
    "user_liked": true,
    "user_disliked": false,
    "author_coupon_points": 120
  },
  "amount_earned": 1.00,
  "points_delta": 1
}
```

*Notes sur la réponse :*
- `user_liked` / `user_disliked` : Indiquent l'état actuel du vote de l'utilisateur sur ce coupon.
- `amount_earned` : Montant gagné (ou perdu) par l'auteur suite à ce vote.
- `points_delta` : Variation des points de l'auteur.

**Erreurs possibles :**
- `403 Forbidden` : Pas autorisé à voter.
- `400 Bad Request` : 
  - "Vous avez déjà voté aujourd'hui sur un coupon de cet auteur."
  - "Vous ne pouvez pas voter sur votre propre coupon."

### Processus interne (Monétisation)
- **Like** : Ajoute `monetization_amount` (ex: 1 FCFA) au `CouponWallet` de l'auteur. Ajoute 1 point.
- **Dislike** : Retire `monetization_amount` au `CouponWallet` de l'auteur.
- **Suppression (Annulation)** : Inverse l'effet précédent (retire l'argent gagné si c'était un like).

---

## 3. Commentaires et Avis sur l'Auteur (Profil)

En plus des coupons, les utilisateurs peuvent interagir directement sur le profil des auteurs (Tipsters) via des commentaires et des évaluations globales.

### A. Commentaires Auteur

**1. Créer un commentaire**
- **Endpoint** : `POST /author-comments/`
- **Body** :
  ```json
  {
    "coupon_id": "uuid-du-coupon",
    "content": "Super pronostiqueur, merci !",
    "parent_id": "uuid-commentaire-parent" (optionnel, pour répondre)
  }
  ```
- **Réponse** : Retourne l'objet commentaire créé, incluant le `coupon`, le `coupon_author` et le `user`.
- **Note** : Les commentaires sont liés à l'auteur mais aussi au coupon spécifique.

**2. Lister les commentaires**
- **Endpoint** : `GET /author-comments/list/?coupon_author_id=<uuid>`
- **Description** : Récupère les commentaires de premier niveau pour un auteur donné. Les réponses (`replies`) sont imbriquées dans chaque commentaire.
- **Réponse** : Liste d'objets commentaires.

**3. Modifier un commentaire**
- **Endpoint** : `PATCH /author-comments/<comment_id>/`
- **Body** : `{"content": "Nouveau contenu"}`
- **Règle** : Uniquement pour ses propres commentaires.

**4. Supprimer un commentaire**
- **Endpoint** : `DELETE /author-comments/<comment_id>/`
- **Règle** : Un utilisateur ne peut supprimer que ses propres commentaires (Soft delete).

### B. Évaluation Auteur (Like/Dislike Profil)

Les utilisateurs peuvent "Aimer" ou "Ne pas aimer" un auteur globalement.

**Endpoint** : `POST /author-ratings/`

**Body** :
```json
{
  "coupon_id": "uuid-du-coupon",
  "is_like": true
}
```
*Mettre `false` pour dislike.*

**Réponse** :
```json
{
  "id": "...",
  "user": { ... },
  "coupon_author": { ... },
  "coupon": { ... },
  "is_like": true,
  ...
}
```

### C. Statistiques Auteur

Pour obtenir les compteurs agrégés (nombre de commentaires, total likes/dislikes reçus).

**Endpoint** : `GET /author-stats/<user_id>/`

**Réponse** :
```json
{
  "user": { ... },
  "total_comments": 42,
  "total_likes": 150,
  "total_dislikes": 5,
  "updated_at": "..."
}
```

---

## 4. Obtenir la Liste des Coupons

### Endpoint
```
GET /coupon
```

### Permissions
- **Authentification** : **Non requise** (`AllowAny` pour GET)
- **Note spéciale** : L'utilisateur avec l'email `codelabbj@gmail.com` reçoit une liste vide (seulement si connecté)

### Requête

**Headers (optionnel si non connecté) :**
```
Authorization: Bearer <token_jwt>  # Optionnel pour GET
```

**Query Parameters (optionnels) :**
- `bet_app` : Filtrer par ID d'application
- `page` : Numéro de page (pagination)
- `page_size` : Taille de la page (pagination)

**Exemple :**
```
GET /coupon?bet_app=uuid-app&page=1&page_size=20
```

### Réponse

**Succès (200 OK) :**
```json
{
  "count": 150,
  "next": "http://api.example.com/coupon?page=2",
  "previous": null,
  "results": [
    {
      "id": "uuid-coupon-1",
      "created_at": "2024-01-15T10:30:00Z",
      "code": "CODE_PROMO_123",
      "bet_app": {
        "id": "uuid-app",
        "name": "XBet",
        "public_name": "XBet"
      },
      "bet_app_id": "uuid-app",
      "author": "uuid-auteur",
      "author_name": "John Doe",
      "average_rating": 4.50,
      "total_ratings": 20,
      "user_rating": 5,
      "can_rate": false,
      "comments": [
        {
          "id": "uuid-comment-1",
          "content": "Excellent coupon !",
          "created_at": "2024-02-06T12:00:00Z",
          "author": {
            "id": "uuid-user-a",
            "email": "user@gmail.com",
            "first_name": "Alice",
            "last_name": "Sero"
          }
        }
      ]
    },
    {
      "id": "uuid-coupon-2",
      "created_at": "2024-01-14T09:15:00Z",
      "code": "PROMO456",
      "bet_app": {
        "id": "uuid-app-2",
        "name": "BetWinner",
        "public_name": "BetWinner"
      },
      "bet_app_id": "uuid-app-2",
      "author": "uuid-auteur-2",
      "author_name": "Jane Smith",
      "average_rating": 3.75,
      "total_ratings": 8,
      "user_rating": null,
      "can_rate": true,
      "comments": []
    }
  ]
}
```

### Champs de réponse expliqués

- `id` : UUID unique du coupon
- `created_at` : Date de création
- `code` : Code promotionnel
- `bet_app` : Informations de l'application de paris
- `author` : UUID de l'auteur
- `author_name` : Nom complet de l'auteur
- `average_rating` : Moyenne des notes (0.00 à 5.00)
- `total_ratings` : Nombre total de votes reçus
- `user_rating` : Note donnée par l'utilisateur actuel (`null` si pas connecté ou pas encore voté)
- `can_rate` : Indique si l'utilisateur actuel peut noter ce coupon (`false` si non connecté)
- `comments` : Liste des 5 derniers commentaires (avec les infos de l'auteur de chaque commentaire)
- `total_comments` : Nombre total de commentaires non supprimés sur ce coupon

### Processus interne

1. **Filtrage par date** : Affiche uniquement les coupons créés dans les dernières 24 heures
   ```python
   Coupon.objects.filter(
       created_at__lte=timezone.now() + relativedelta(days=1)
   )
   ```
2. **Filtrage par application** (si `bet_app` fourni)
3. **Tri** : Par défaut, trié par `-created_at` (plus récents en premier)
4. **Pagination** : Utilise la classe `Pagination` personnalisée
5. **Calcul dynamique** :
   - `user_rating` : Récupère la note de l'utilisateur connecté depuis `CouponRating`
   - `can_rate` : Vérifie si l'utilisateur peut noter (permission + pas encore voté)

### Filtres disponibles

- **Par application** : `?bet_app=<uuid>`
- **Pagination** : `?page=<numéro>&page_size=<taille>`

---

## Modèles de Données

### Coupon

```python
{
  "id": UUID,
  "created_at": DateTime,
  "code": String (max 150),
  "bet_app": ForeignKey(AppName),
  "author": ForeignKey(User),
  "likes_count": Integer (default=0),
  "dislikes_count": Integer (default=0),
  "total_ratings": Integer (default=0),
  "sum_ratings": Integer (default=0)
}
```

### CouponRating

```python
{
  "id": UUID,
  "user": ForeignKey(User),
  "coupon": ForeignKey(Coupon),
  "is_like": Boolean (True=Like, False=Dislike),
  "created_at": DateTime
}
```

### AuthorComment (Nouveau)

```python
{
  "id": UUID,
  "author": ForeignKey(User),
  "coupon_author": ForeignKey(User),
  "coupon": ForeignKey(Coupon),
  "content": Text,
  "parent": ForeignKey(Self, null=True),
  "is_deleted": Boolean (default=False),
  "created_at": DateTime
}
```

### AuthorCouponRating (Nouveau)

```python
{
  "id": UUID,
  "user": ForeignKey(User),
  "coupon_author": ForeignKey(User),
  "coupon": ForeignKey(Coupon),
  "is_like": Boolean (True=Like, False=Dislike),
  "created_at": DateTime
}
```

### AuthorStats (Nouveau)

```python
{
  "user": OneToOneField(User),
  "total_comments": Integer,
  "total_likes": Integer,
  "total_dislikes": Integer,
  "updated_at": DateTime
}
```

**Contrainte unique** : Un utilisateur ne peut noter qu'une seule fois par coupon (`unique_together = ['user', 'coupon']`)

---

## Système de Rémunération

### Conditions

L'auteur reçoit une rémunération uniquement si :
- `author.can_publish_coupons = True`
- Le vote est créé avec succès

### Montant

- Montant par vote = `Setting.monetization_amount` (par défaut : 1.00 XOF)
- Configurable par l'administrateur dans les paramètres

### Processus de crédit

1. **Crédit immédiat** dans `CouponWallet` :
   - `wallet.balance += amount_per_vote`
   - `wallet.total_earned += amount_per_vote`

2. **Mise à jour du revenu total** :
   - `author.earned_money += amount_per_vote`

3. **Création d'un historique** (`CouponPayout`) :
   - `payout_type = "per_vote"`
   - `status = "completed"`
   - `payment_method = "wallet_credit"`

---

## Permissions Utilisateur

### Champs du Modèle User pour le Frontend

Le modèle `User` expose trois champs spécifiques aux coupons que le frontend peut utiliser pour déterminer les permissions :

#### 1. `can_publish_coupons` (Boolean)
- **Indique si l'utilisateur peut publier des coupons.**
- Utilisation : Afficher bouton "Créer un coupon".

#### 2. `can_rate_coupons` (Boolean)
- **Indique si l'utilisateur peut voter (Like/Dislike).**
- Utilisation : Afficher les pouces haut/bas.
- Attribution auto : > 1 mois ancienneté + 15k transactions.

#### 3. `coupon_points` (Decimal)
- Points de réputation de l'auteur.

---

## Exemples d'Utilisation

### Exemple 1 : Créer un coupon

```bash
curl -X POST https://api.example.com/coupon \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bet_app_id": "123e4567-e89b-12d3-a456-426614174000",
    "code": "WELCOME2024"
  }'
```

### Exemple 2 : Voter pour un coupon (Like)

```bash
curl -X POST https://api.example.com/coupons/123e4567-e89b-12d3-a456-426614174000/vote/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "vote_type": "like"
  }'
```

### Exemple 3 : Commenter un auteur

```bash
curl -X POST https://api.example.com/author-comments/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "coupon_id": "uuid-du-coupon",
    "content": "Excellent travail !"
  }'
```

### Exemple 4 : Liker un auteur (via un coupon)

```bash
curl -X POST https://api.example.com/author-ratings/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "coupon_id": "uuid-du-coupon",
    "is_like": true
  }'
```

---

## Notes Importantes

1. **Un vote par jour et par auteur** : Limite pour éviter les abus et le spam de votes.
2. **Rémunération dynamique** : Le solde varie en temps réel selon les likes (gain) et dislikes (perte ou neutre).
3. **Statistiques en temps réel** : Les compteurs `likes_count` et `dislikes_count` sont mis à jour immédiatement.
4. **Suppression de vote** : Si un utilisateur refait le même vote, cela annule son vote précédent.
5. **Filtrage temporel** : Seuls les coupons des dernières 24 heures sont affichés dans la liste principale.
6. **Transaction atomique** : Toutes les opérations (vote, argent, points) sont atomiques.
7. **Interactions liées au Coupon** : Les commentaires (`AuthorComment`) et les notations auteur (`AuthorCouponRating`) sont liés à l'auteur mais **DOIVENT** être initiés via un `coupon_id`. Cela permet de savoir quel coupon a suscité l'interaction.

---

## Endpoints Complémentaires

- `GET /coupon/<uuid>` : Détails d'un coupon spécifique
- `PUT /coupon/<uuid>` : Modifier un coupon (auteur ou admin uniquement)
- `DELETE /coupon/<uuid>` : Supprimer un coupon (auteur ou admin uniquement)
- `GET /coupon-wallet` : Consulter son portefeuille coupon
- `GET /user/coupon-stats/` : Statistiques de ses coupons publiés
- `POST /coupon-wallet-withdraw` : Retirer de l'argent du portefeuille coupon
- `POST /author-comments/` : Poster un commentaire sur le profil d'un auteur (via un coupon)
- `POST /author-ratings/` : Liker/Disliker le profil d'un auteur (via un coupon)
- `GET /author-stats/<user_id>/` : Voir les stats (likes/dislikes) d'un auteur
