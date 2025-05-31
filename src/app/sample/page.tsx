"use client"
 
import React, { useState } from 'react';
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  Gift, 
  User, 
  Bell, 
  Settings, 
  
  ChevronRight,
  
} from 'lucide-react';

export default function BlaffaDashboard() {
 
  const transactions = [
    {
      id: 1,
      type: 'deposit',
      amount: 1000,
      currency: 'FCFA',
      ref: 'YNF1748...',
      date: '28 mai 2025, 12:25',
      status: 'accepted'
    },
    {
      id: 2,
      type: 'withdrawal',
      amount: 0,
      currency: 'FCFA',
      ref: 'XNU1748...',
      date: '29 mai 2025, 08:51',
      status: 'failed'
    },
    {
      id: 3,
      type: 'withdrawal',
      amount: 900,
      currency: 'FCFA',
      ref: 'SWX1748...',
      date: '27 mai 2025, 19:30',
      status: 'processing'
    },
    {
      id: 4,
      type: 'withdrawal',
      amount: 920,
      currency: 'FCFA',
      ref: 'YWG1748...',
      date: '27 mai 2025, 19:30',
      status: 'processing'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'text-green-600 bg-green-50';
      case 'failed': return 'text-red-600 bg-red-50';
      case 'processing': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTransactionIcon = (type: string) => {
    return type === 'deposit' ? (
      <ArrowDownLeft className="w-5 h-5 text-green-600" />
    ) : (
      <ArrowUpRight className="w-5 h-5 text-red-600" />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">Y</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Blaffa
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bienvenue sur Blaffa</h1>
          <p className="text-gray-600">Gérez vos finances en toute simplicité</p>
        </div>

        <div className="grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Balance Card */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-8 text-white">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
              
              <div className="relative z-10">
                {/* <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-medium opacity-90">Solde Principal</h2>
                  <button 
                    onClick={() => setShowBalance(!showBalance)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    {showBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                </div> */}
                
                {/* <div className="mb-8">
                  <span className="text-4xl font-bold">
                    {showBalance ? '2,820' : '****'}
                  </span>
                  <span className="text-xl ml-2 opacity-90">FCFA</span>
                </div> */}

                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/15 transition-all cursor-pointer group">
                    <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                      <ArrowUpRight className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-medium">Déposer</span>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/15 transition-all cursor-pointer group">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                      <ArrowDownLeft className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-medium">Retirer</span>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/15 transition-all cursor-pointer group">
                    <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                      <Gift className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-medium">Coupon</span>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/15 transition-all cursor-pointer group">
                    <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-medium">Mon ID</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Revenus ce mois</p>
                    <p className="text-2xl font-bold text-green-600">+1,200 FCFA</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Transactions</p>
                    <p className="text-2xl font-bold text-blue-600">24</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Épargne</p>
                    <p className="text-2xl font-bold text-purple-600">450 FCFA</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <PiggyBank className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div> */}

            {/* Transaction History */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">Historique</h3>
                  <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1">
                    <span>Voir tout</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 capitalize">
                            {transaction.type === 'deposit' ? 'Dépôt' : 'Retrait'}
                          </h4>
                          <p className="text-sm text-gray-600">Réf: {transaction.ref}</p>
                          <p className="text-xs text-gray-500">{transaction.date}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-bold text-lg text-gray-900">
                          {transaction.amount > 0 ? `${transaction.amount} ${transaction.currency}` : `0 ${transaction.currency}`}
                        </p>
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(transaction.status)}`}>
                          {transaction.status === 'accepted' ? 'Accepté' : 
                           transaction.status === 'failed' ? 'Échoué' : 'En cours'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          {/* <div className="space-y-6"> */}
            {/* Profile Card */}
            {/* <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full mx-auto mb-4"></div>
                <h3 className="font-semibold text-gray-900 mb-1">Utilisateur Blaffa</h3>
                <p className="text-gray-600 text-sm">Membre depuis 2024</p>
              </div>
            </div> */}

            {/* Quick Actions */}
            {/* <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Actions rapides</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-xl transition-colors">
                  <span className="text-gray-700">Télécharger relevé</span>
                  <Download className="w-4 h-4 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-xl transition-colors">
                  <span className="text-gray-700">Paramètres de compte</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-xl transition-colors">
                  <span className="text-gray-700">Support client</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div> */}

            {/* Security Notice */}
            {/* <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-amber-600 text-sm">🔒</span>
                </div>
                <div>
                  <h4 className="font-semibold text-amber-900 mb-1">Sécurité</h4>
                  <p className="text-amber-700 text-sm">
                    Votre compte est sécurisé avec un chiffrement de niveau bancaire.
                  </p>
                </div>
              </div>
            </div> */}
          {/* </div> */}
        </div>
      </div>
    </div>
  );
}