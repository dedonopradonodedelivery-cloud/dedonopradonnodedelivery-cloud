

import React, { useState, useEffect } from 'react';
import { ChevronLeft, CheckCircle, XCircle, Clock, DollarSign, User, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { CashbackTransaction } from '../types'; // Corrected import path

interface MerchantCashbackRequestsProps {
  merchantId: string; // ID do lojista logado
  onBack: () => void;
}

// FIX: Changed interface to extend the global CashbackTransaction type for consistency.
interface ExtendedCashbackTransaction extends CashbackTransaction {
  customer_name?: string;
}

export const MerchantCashbackRequests: React.FC<MerchantCashbackRequestsProps> = ({ merchantId, onBack }) => {
  const [requests, setRequests] = useState<ExtendedCashbackTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<ExtendedCashbackTransaction | null>(null);

  // --- Realtime & Fetch ---
  useEffect(() => {
    fetchPendingRequests();

    if (!supabase) return;

    // Listener para MUDANÇAS em tempo real
    // Escuta INSERT (nova compra) e UPDATE (aprovada/rejeitada) na tabela
    const channel = supabase
      .channel('merchant_transactions_channel')
      .on(
        'postgres_changes',
        {
          event: '*', 
          schema: 'public',
          table: 'cashback_transactions',
          filter: `merchant_id=eq.${merchantId}`,
        },
        (payload) => {
          // Recarrega a lista para garantir consistência e ordenação
          // Em um cenário de altíssimo volume, faríamos manipulação otimista do state array
          fetchPendingRequests();
        }
      )
      .subscribe();

    return