# Documentation du Processus de Coupon

## Vue d'ensemble

Le système de coupons permet aux utilisateurs autorisés de publier des codes promotionnels et à la communauté de les noter. Chaque vote génère une rémunération pour l'auteur du coupon.

## 📋 Résumé Rapide pour le Frontend

### Endpoints Principaux
- **Créer un coupon** : `POST /coupon` (nécessite `can_publish_coupons` ou `is_staff`)
- **Noter un coupon** : `POST /coupons/<coupon_id>/rate/` (nécessite `can_rate_coupons`)
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

## 2. Noter un Coupon

### Endpoint
```
POST /coupons/<coupon_id>/rate/
```

### Permissions
- **Authentification requise** : `IsAuthenticated`
- **Autorisation** : L'utilisateur doit avoir `can_rate_coupons = True`
  - Cette permission est accordée automatiquement aux utilisateurs avec :
    - Au moins 1 mois d'ancienneté
    - Au moins 15 000 FCFA de transactions acceptées

### Requête

**Headers :**
```
Authorization: Bearer <token_jwt>
Content-Type: application/json
```

**Body :**
```json
{
  "rating": 5
}
```

**Champs :**
- `rating` (requis) : Note entre 1 et 5 étoiles

### Réponse

**Succès (201 Created) :**
```json
{
  "message": "Note enregistrée avec succès",
  "new_average": 4.50,
  "amount_earned": 1.00
}
```

**Erreurs possibles :**
- `403 Forbidden` : L'utilisateur n'a pas l'autorisation de noter
- `404 Not Found` : Le coupon n'existe pas
- `400 Bad Request` : 
  - L'utilisateur a déjà noté ce coupon
  - La note n'est pas entre 1 et 5

### Processus interne

1. **Vérification de la permission** (`can_rate_coupons`)
2. **Vérification de l'existence du coupon**
3. **Vérification du vote unique** : Un utilisateur ne peut noter qu'une seule fois par coupon
4. **Validation de la note** (1-5 étoiles)
5. **Création du vote** (`CouponRating`) :
   ```python
   CouponRating.objects.create(
       user=request.user,
       coupon=coupon,
       rating=rating_value
   )
   ```
6. **Mise à jour des statistiques du coupon** :
   - `total_ratings += 1`
   - `sum_ratings += rating.rating`
   - `average_rating = sum_ratings / total_ratings`
7. **Rémunération de l'auteur** (si `author.can_publish_coupons = True`) :
   - Montant par vote = `Setting.monetization_amount` (par défaut 1.00 XOF)
   - Crédit immédiat dans le portefeuille (`CouponWallet`)
   - Création d'un historique de paiement (`CouponPayout`)

### Contraintes

- **Un vote par utilisateur** : `unique_together = ['user', 'coupon']` dans `CouponRating`
- **Note valide** : Entre 1 et 5 étoiles uniquement
- **Transaction atomique** : Toute l'opération est dans une transaction pour garantir la cohérence

---

## 3. Obtenir la Liste des Coupons

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
      "can_rate": false
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
      "can_rate": true
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
  "total_ratings": Integer (default=0),
  "sum_ratings": Integer (default=0),
  "average_rating": Decimal(3,2) (default=0.00)
}
```

### CouponRating

```python
{
  "id": UUID,
  "user": ForeignKey(User),
  "coupon": ForeignKey(Coupon),
  "rating": Integer (1-5),
  "created_at": DateTime
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
- **Type** : `BooleanField`
- **Valeur par défaut** : `false`
- **Description** : Indique si l'utilisateur peut publier des coupons
- **Utilisation frontend** : 
  - Afficher/masquer le bouton "Créer un coupon"
  - Autoriser l'accès à l'endpoint `POST /coupon`
- **Attribution** : Manuelle par un administrateur

**Exemple de vérification frontend :**
```javascript
if (user.can_publish_coupons || user.is_staff) {
  // Afficher le bouton "Créer un coupon"
  // Autoriser l'accès à POST /coupon
}
```

#### 2. `can_rate_coupons` (Boolean)
- **Type** : `BooleanField`
- **Valeur par défaut** : `false`
- **Description** : Indique si l'utilisateur peut noter des coupons
- **Utilisation frontend** :
  - Afficher/masquer les boutons de notation (étoiles 1-5)
  - Autoriser l'accès à l'endpoint `POST /coupons/<coupon_id>/rate/`
- **Attribution** : Automatique via une tâche Celery (`grant_coupon_rating_permissions`)

**Critères d'attribution automatique :**
- Au moins **1 mois d'ancienneté** (`date_joined <= 1 mois`)
- Au moins **15 000 FCFA** de transactions acceptées (`status="accept"`)

**Exemple de vérification frontend :**
```javascript
if (user.can_rate_coupons && coupon.can_rate) {
  // Afficher les boutons de notation
  // Autoriser l'accès à POST /coupons/{coupon_id}/rate/
}
```

#### 3. `coupon_points` (Decimal)
- **Type** : `DecimalField(max_digits=10, decimal_places=2)`
- **Valeur par défaut** : `0.00`
- **Description** : Points gagnés par l'utilisateur (non utilisé actuellement dans le système de rémunération)
- **Utilisation frontend** : Affichage informatif (optionnel)

### Publier des Coupons (`can_publish_coupons`)

Attribuée manuellement par un administrateur.

**Vérification backend :**
```python
if not (request.user.is_staff or request.user.can_publish_coupons):
    return Response(status=status.HTTP_403_FORBIDDEN)
```

### Noter des Coupons (`can_rate_coupons`)

Attribuée automatiquement via une tâche Celery (`grant_coupon_rating_permissions`) aux utilisateurs qui :
- Ont au moins **1 mois d'ancienneté** (`date_joined <= 1 mois`)
- Ont effectué au moins **15 000 FCFA** de transactions acceptées (`status="accept"`)

**Vérification backend :**
```python
if not request.user.can_rate_coupons:
    return Response(
        {"error": "Vous n'avez pas l'autorisation de noter des coupons"},
        status=status.HTTP_403_FORBIDDEN,
    )
```

### Recommandations pour le Frontend

1. **Vérifier les permissions avant d'afficher les actions** :
   - Utiliser `user.can_publish_coupons` pour afficher le bouton de création
   - Utiliser `user.can_rate_coupons` pour afficher les boutons de notation

2. **Gérer les erreurs 403** :
   - Si l'utilisateur tente de créer un coupon sans permission → Afficher un message explicatif
   - Si l'utilisateur tente de noter sans permission → Afficher les critères d'éligibilité

3. **Utiliser le champ `can_rate` du coupon** :
   - Le champ `can_rate` dans la réponse de `GET /coupon` combine :
     - La permission `can_rate_coupons` de l'utilisateur
     - Le fait qu'il n'ait pas déjà voté pour ce coupon
   - Utiliser ce champ pour une vérification rapide côté frontend

4. **Exemple de structure User pour le frontend** :
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

### Exemple 2 : Noter un coupon

```bash
curl -X POST https://api.example.com/coupons/123e4567-e89b-12d3-a456-426614174000/rate/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 5
  }'
```

### Exemple 3 : Lister les coupons

**Sans authentification :**
```bash
curl -X GET "https://api.example.com/coupon?bet_app=123e4567-e89b-12d3-a456-426614174000&page=1"
```

**Avec authentification (pour avoir user_rating et can_rate) :**
```bash
curl -X GET "https://api.example.com/coupon?bet_app=123e4567-e89b-12d3-a456-426614174000&page=1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Notes Importantes

1. **Un vote par utilisateur** : Un utilisateur ne peut noter qu'une seule fois chaque coupon
2. **Rémunération immédiate** : L'auteur reçoit l'argent directement dans son portefeuille
3. **Statistiques en temps réel** : Les statistiques (`average_rating`, `total_ratings`) sont mises à jour immédiatement après chaque vote
4. **Filtrage temporel** : Seuls les coupons des dernières 24 heures sont affichés dans la liste
5. **Transaction atomique** : La notation est effectuée dans une transaction pour garantir la cohérence des données
6. **Accès public à la liste** : L'endpoint `GET /coupon` est accessible sans authentification. Les champs `user_rating` et `can_rate` seront `null`/`false` si l'utilisateur n'est pas connecté

---

## Endpoints Complémentaires

- `GET /coupon/<uuid>` : Détails d'un coupon spécifique
- `PUT /coupon/<uuid>` : Modifier un coupon (auteur ou admin uniquement)
- `DELETE /coupon/<uuid>` : Supprimer un coupon (auteur ou admin uniquement)
- `GET /coupon-wallet` : Consulter son portefeuille coupon
- `GET /user/coupon-stats/` : Statistiques de ses coupons publiés
- `POST /coupon-wallet-withdraw` : Retirer de l'argent du portefeuille coupon

