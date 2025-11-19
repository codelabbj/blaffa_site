# Guide: Adding Bet ID Search Functionality

This guide explains how to implement the same bet ID search functionality with the same logic, modal display, endpoint with params, and validation.

## Overview

The bet ID search feature allows users to:
1. Search for a user by bet ID and app
2. Validate the user exists and has the correct currency (CurrencyId === 27)
3. Display confirmation/error modals
4. Add the validated bet ID to saved IDs
5. View and manage saved bet IDs

## Key Components

### 1. API Endpoints

#### Search User Endpoint
```
GET /blaffa/search-user?app_id={appId}&userid={betId}
```

**Parameters:**
- `app_id`: The selected app ID (string)
- `userid`: The bet ID to search for (URL encoded string)

**Headers:**
```javascript
{
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
}
```

**Response:**
```typescript
{
  UserId: number;        // 0 if not found
  Name: string;          // User's name
  CurrencyId: number;    // Must be 27 for XOF currency
}
```

#### Add Bet ID Endpoint
```
POST /blaffa/id_link
```

**Body:**
```json
{
  "link": "bet_id_string",
  "app_name_id": "app_id_string"
}
```

**Headers:**
```javascript
{
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
}
```

#### Fetch Saved Bet IDs
```
GET /blaffa/id_link
```

**Response:** Array of `IdLink` objects

#### Fetch Available Apps
```
GET /blaffa/app_name
```

**Response:** Array of `App` objects

---

## 2. TypeScript Interfaces

```typescript
interface App {
  id: string;
  name: string;
  image: string;
  is_active: boolean;
  hash: string;
  cashdeskid: string;
  cashierpass: string;
  order: string | null;
  city: string;
  street: string;
  deposit_tuto_content: string;
  deposit_link: string;
  withdrawal_tuto_content: string;
  withdrawal_link: string;
  public_name: string;
}

interface IdLink {
  id: string;
  user: string;
  link: string;
  app_name: App;
}

type ConfirmModalData = {
  Name: string;
  UserId: number;
  CurrencyId: number;
};

type ModalState = 
  | null
  | { type: 'confirm'; data: ConfirmModalData }
  | { type: 'error'; message: string; title?: string };
```

---

## 3. State Management

```typescript
const [error, setError] = useState<string | null>(null);
const [success, setSuccess] = useState<string | null>(null);
const [savedAppIds, setSavedAppIds] = useState<IdLink[]>([]);
const [newAppId, setNewAppId] = useState('');
const [selectedApp, setSelectedApp] = useState('');
const [apps, setApps] = useState<App[]>([]);
const [loading, setLoading] = useState(true);
const [modal, setModal] = useState<ModalState>(null);
const [pendingBetId, setPendingBetId] = useState<{ appId: string; betId: string } | null>(null);
```

---

## 4. Core Functions

### 4.1 Search User and Validate

```typescript
const handleSearchUserAndAdd = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setSuccess(null);

  // Validation
  if (!selectedApp || !newAppId.trim()) {
    setError(t('Veuillez sélectionner une application et saisir un ID de pari.'));
    return;
  }

  const token = localStorage.getItem('accessToken');
  if (!token) {
    setError(t('Vous devez être connecté pour ajouter un ID de pari.'));
    return;
  }

  try {
    // Search user API call
    const searchResponse = await api.get(
      `/blaffa/search-user?app_id=${selectedApp}&userid=${encodeURIComponent(newAppId.trim())}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    
    const searchData = searchResponse.data;
    
    // Check if user exists
    if (searchData && searchData.UserId && searchData.UserId !== 0) {
      // Validate CurrencyId === 27 (XOF - West Africa)
      if (searchData.CurrencyId !== 27) {
        setModal({
          type: 'error',
          title: t('Compte non trouvé'),
          message: t('Aucun compte n\'a été trouvé avec l\'ID {{betid}} ou votre compte n\'est pas configuré en Franc CFA (XOF - Afrique de l\'Ouest). Assurez-vous que l\'identifiant est correct et que votre compte est bien rattaché à la zone XOF, puis réessayez.', { betid: newAppId.trim() }),
        });
        return;
      }
      
      // Show confirmation modal
      setModal({
        type: 'confirm',
        data: {
          Name: searchData.Name,
          UserId: searchData.UserId,
          CurrencyId: searchData.CurrencyId,
        },
      });
      setPendingBetId({ appId: selectedApp, betId: newAppId.trim() });
    } else {
      // User not found
      setModal({
        type: 'error',
        title: t('Compte non trouvé'),
        message: t('Aucun compte n\'a été trouvé avec l\'ID {{betid}}. Assurez-vous que l\'identifiant est correct et réessayez.', { betid: newAppId.trim() }),
      });
    }
  } catch {
    setModal({
      type: 'error',
      title: t('Erreur de validation'),
      message: t('Échec de la validation de l\'ID de pari. Veuillez réessayer.'),
    });
  }
};
```

### 4.2 Confirm and Add Bet ID

```typescript
const handleConfirmAddBetId = async () => {
  if (!pendingBetId) return;
  setModal(null);
  setError(null);
  setSuccess(null);
  
  const { appId, betId } = pendingBetId;
  const token = localStorage.getItem('accessToken');
  
  if (!token) {
    setError(t('Vous devez être connecté pour ajouter un ID de pari.'));
    return;
  }
  
  try {
    const response = await api.post(
      `/blaffa/id_link`,
      {
        link: betId,
        app_name_id: appId,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    
    if (response.status !== 200 && response.status !== 201) {
      const errorData = response.data;
      if (response.status === 400 && errorData) {
        const errorMessages = Object.entries(errorData)
          .map(([field, errors]) => {
            if (Array.isArray(errors)) {
              return `${field}: ${errors.join(', ')}`;
            }
            return `${field}: ${errors}`;
          })
          .join('\n');
        throw new Error(errorMessages);
      }
      throw new Error(errorData.detail || t('Failed to add bet ID'));
    }
    
    setSuccess(t('ID de pari ajouté avec succès !'));
    setNewAppId('');
    setSelectedApp('');
    setPendingBetId(null);
    await fetchBetIds(); // Refresh the list
  } catch (error: unknown) {
    if (error instanceof Error) {
      setError(error.message || t('Failed to add bet ID'));
    } else {
      setError(t('Failed to add bet ID'));
    }
  }
};
```

### 4.3 Fetch Functions

```typescript
// Fetch user's saved bet IDs
const fetchBetIds = async () => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    console.error("Access token not found for fetching saved app IDs.");
    setSavedAppIds([]);
    return;
  }

  try {
    const response = await api.get(`/blaffa/id_link`, {
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
    });

    if (response.status === 200) {
      const data = response.data;
      let processedData: IdLink[] = [];
      
      // Handle different response formats
      if (Array.isArray(data)) {
        processedData = data;
      } else if (data && Array.isArray(data.results)) {
        processedData = data.results;
      } else if (data && Array.isArray(data.data)) {
        processedData = data.data;
      } else if (data && data.id && data.link && data.app_name) {
        processedData = [data];
      }
      
      setSavedAppIds(processedData);
    } else {
      console.error('Failed to fetch saved app IDs:', response.status);
      setSavedAppIds([]);
    }
  } catch (error) {
    console.error('Error fetching bet IDs:', error);
    setSavedAppIds([]);
  }
};

// Fetch available apps
const fetchApps = async () => {
  const token = localStorage.getItem('accessToken');
  if (!token) return;

  try {
    const response = await api.get(`/blaffa/app_name`, {
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
    });
    
    if (response.status === 200) {
      const data = response.data;
      setApps(Array.isArray(data) ? data : []);
    } else {
      console.error('Failed to fetch apps:', response.status);
      setApps([]);
    }
  } catch (error) {
    console.error('Error fetching apps:', error);
    setApps([]);
  }
};
```

---

## 5. Modal Component

### 5.1 Modal Rendering Logic

```typescript
{modal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
    <div className={`${modal.type === 'error' ? 'bg-white' : `bg-gradient-to-r ${theme.colors.a_background}`} rounded-2xl shadow-2xl p-8 max-w-md w-full relative`}>
      {modal.type === 'confirm' ? (
        <>
          <h3 className="text-xl font-bold mb-4">{t('Confirmer l\'ID de pari')}</h3>
          <div className="mb-4">
            <div><span className="font-semibold">{t('Nom de l\'utilisateur')}:</span> {modal.data.Name}</div>
            <div><span className="font-semibold">{t('ID de pari')}:</span> {modal.data.UserId}</div>
            <div><span className="font-semibold">{t('Appareil')}:</span> {modal.data.CurrencyId}</div>
          </div>
          <div className="flex gap-4 mt-6">
            <button
              className="flex-1 px-4 py-2 bg-gray-400 dark:bg-slate-700 rounded hover:bg-gray-300 dark:hover:bg-slate-600"
              onClick={() => { setModal(null); setPendingBetId(null); }}
            >
              {t('Annuler')}
            </button>
            <button
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={handleConfirmAddBetId}
            >
              {t('Confirmer')}
            </button>
          </div>
        </>
      ) : (
        <>
          <h3 className="text-xl font-bold mb-4 text-gray-900">{modal.title || t('ID de pari invalide')}</h3>
          <div className="mb-4 text-gray-700">{modal.message}</div>
          <div className="flex justify-end mt-6">
            <button
              className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
              onClick={() => setModal(null)}
            >
              {t('Quitter')}
            </button>
          </div>
        </>
      )}
    </div>
  </div>
)}
```

---

## 6. Form UI Structure

### 6.1 Search Form

```tsx
<form onSubmit={handleSearchUserAndAdd}>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {/* App Selection */}
    <div>
      <label className="block text-sm font-medium text-slate-400 mb-2">
        {t("App Name")}
      </label>
      <select
        value={selectedApp}
        onChange={(e) => setSelectedApp(e.target.value)}
        className={`w-full p-4 ${theme.colors.c_background} border border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
      >
        <option value="">{t("Select App")}</option>
        {apps.map((app) => (
          <option key={app.id} value={app.id}>
            {app.public_name || app.name}
          </option>
        ))}
      </select>
    </div>
    
    {/* Bet ID Input */}
    <div>
      <label className="block text-sm font-medium text-slate-400 mb-2">
        {t("User Bet ID")}
      </label>
      <input
        type="text"
        value={newAppId}
        onChange={(e) => setNewAppId(e.target.value)}
        className={`w-full p-4 ${theme.colors.c_background} border border-slate-600/50 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
        placeholder={t("Enter your bet ID")}
      />
    </div>
    
    {/* Submit Button */}
    <div className="flex items-end">
      <button
        type="submit"
        className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-500 hover:to-amber-500 text-white font-medium rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105"
      >
        {t('Add Bet ID')}
      </button>
    </div>
  </div>
</form>
```

---

## 7. Implementation Steps

### Step 1: Set up State Variables
- Add all required state variables as shown in section 3

### Step 2: Create Fetch Functions
- Implement `fetchBetIds()` to load saved IDs
- Implement `fetchApps()` to load available apps
- Call both in `useEffect` on component mount

### Step 3: Implement Search Logic
- Create `handleSearchUserAndAdd()` function
- Make API call to `/blaffa/search-user` with proper params
- Validate `CurrencyId === 27`
- Set modal state based on results

### Step 4: Implement Add Logic
- Create `handleConfirmAddBetId()` function
- Make POST request to `/blaffa/id_link`
- Handle success/error states
- Refresh the bet IDs list after success

### Step 5: Add Modal Component
- Add modal rendering JSX
- Handle both 'confirm' and 'error' modal types
- Include cancel/confirm buttons

### Step 6: Add Form UI
- Create form with app selector and bet ID input
- Connect form submission to search handler
- Add error/success message display

### Step 7: Add Required Imports
```typescript
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '@/lib/axios';
import { useTheme } from '@/components/ThemeProvider';
```

---

## 8. Key Validation Rules

1. **User Must Exist**: `UserId !== 0`
2. **Currency Validation**: `CurrencyId === 27` (XOF - West Africa)
3. **Form Validation**: Both app and bet ID must be provided
4. **Authentication**: Token must be present in localStorage

---

## 9. Error Handling

### Search Errors
- User not found → Error modal with bet ID in message
- Wrong currency → Error modal explaining XOF requirement
- API error → Generic validation error modal

### Add Errors
- 400 status → Parse and display field-specific errors
- Other errors → Display generic error message
- Success → Show success message and refresh list

---

## 10. Complete Flow Diagram

```
User Input (App + Bet ID)
    ↓
Form Submit
    ↓
Validate Inputs
    ↓
GET /blaffa/search-user?app_id=X&userid=Y
    ↓
Check Response
    ├─ UserId === 0 → Error Modal (User not found)
    ├─ CurrencyId !== 27 → Error Modal (Wrong currency)
    └─ Valid → Confirmation Modal
            ↓
        User Confirms
            ↓
        POST /blaffa/id_link
            ↓
        Success → Refresh List + Clear Form
        Error → Display Error Message
```

---

## 11. Testing Checklist

- [ ] Search with valid bet ID and correct currency
- [ ] Search with invalid bet ID
- [ ] Search with bet ID that has wrong currency
- [ ] Cancel confirmation modal
- [ ] Confirm and add bet ID
- [ ] Handle API errors gracefully
- [ ] Verify saved IDs are displayed correctly
- [ ] Test with missing authentication token
- [ ] Test form validation (empty fields)

---

## 12. Notes

- The bet ID is URL encoded when passed as a query parameter
- The `pendingBetId` state stores the app and bet ID between modal confirmation and API call
- Error messages use i18n translation keys
- The modal uses different styling for error (white background) vs confirm (theme background)
- CurrencyId 27 represents XOF (West African CFA Franc)

---

## Quick Reference: API Calls

```typescript
// Search User
api.get(`/blaffa/search-user?app_id=${appId}&userid=${encodeURIComponent(betId)}`)

// Add Bet ID
api.post(`/blaffa/id_link`, { link: betId, app_name_id: appId })

// Get Saved IDs
api.get(`/blaffa/id_link`)

// Get Apps
api.get(`/blaffa/app_name`)
```

All requests require:
- `Authorization: Bearer ${token}` header
- `Content-Type: application/json` header



