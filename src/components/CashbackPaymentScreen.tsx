

import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  Wallet, 
  Store, 
  ArrowRight, 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  Coins, 
  AlertTriangle, 
  Clock,
  // FIX: Added Smartphone and Send to lucide-react imports
  Smartphone,
  Send
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
// FIX: Changed User import to be from supabase, not firebase
import { User } from '@supabase/supabase-js';
import { PayWithCashback } from '../../components/PayWithCashback';
import { getEffectiveBalance, initiateTransaction, validateStoreCode as fetchStoreDetails } from '../backend/services'; // FIX: Imported backend services

interface CashbackPaymentScreenProps {
  user: User | null;
  merchantId: string;
  storeId: string;
  onBack: () => void;
  onComplete: (transactionData: any) => void;
}

export const CashbackPaymentScreen: React.FC<CashbackPaymentScreenProps> = ({ 
  user, 
  merchantId, 
  storeId, 
  onBack, 
  onComplete 
}) => {
  // States
  const [step, setStep] = useState<'input' | 'sending_push' | 'waiting' | 'approved' | 'rejected'>('input');
  const [storeInfo, setStoreInfo] = useState<any>(null);
  
  // Inputs (using text to handle comma/dot safely)
  const [totalAmount, setTotalAmount] = useState('');
  const [cashbackToUse, setCashbackToUse] = useState('');
  
  const [userBalance, setUserBalance] = useState(0); 
  const [isLoading, setIsLoading] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);

  // Load Initial Data
  useEffect(() => {
    const load = async () => {
        if (!user || !supabase) return;
        
        // FIX: Fetch real store info using validateStoreCode (or similar service)
        const info = await fetchStoreDetails(storeId); // Using storeId as the code for lookup
        setStoreInfo(info);
        
        // FIX: Fetch real balance for the user