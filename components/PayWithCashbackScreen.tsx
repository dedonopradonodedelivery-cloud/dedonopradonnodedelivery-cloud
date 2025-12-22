
import React, { useState } from 'react';
import { ChevronLeft, Store, Wallet, ArrowRight, Clock } from 'lucide-react';
import { PayWithCashback } from './PayWithCashback'; // Ensure this path is correct if PayWithCashback is a sibling

interface PayWithCashbackScreenProps {
  storeName: string;
  cashbackPercent: number;
  onPaymentSimulated: (args: { purchaseAmount: number; cashbackUsed: number }) => void;
  onBack: () => void;
}

export default function PayWithCashbackScreen({
  storeName,
  cashbackPercent,
  onPaymentSimulated,
  onBack,
}: PayWithCashbackScreenProps) {
  const [purchaseValue, setPurchaseValue] = useState<string>("");
  const [walletBalance, setWalletBalance] = useState<number>(10.00); // Mock balance
  const [cashbackToUse, setCashbackToUse] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<"form" | "waiting">("form");

  // --- Helpers ---

  const parseCurrency = (value: string): number => {
    if (!value) return 0;
    const numericString = value.replace(/\D/g, "").replace(",","."); // Convert comma to dot for parsing
    return Number(numericString) / 100;
  };

  const formatCurrencyBr = (value: number): string => {
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // --- Handlers ---

  const handlePurchaseChange = (value: string) => {
    // Only allow numbers, commas, and dots
    if (!/^\d*[,.]?\d{0,2}$/.test(value)) return;

    // Convert comma to dot internally for number parsing, but display with comma
    const rawValue = value.replace(",",".");
    const numberValue = Number(rawValue);

    setPurchaseValue(value); // Keep raw input for display

    // If purchase value drops below currently used cashback, cap cashback
    const currentCashback = parseCurrency(cashbackToUse);
    if (currentCashback > numberValue) {
      setCashbackToUse(value);
    }
  };

  const handleCashbackChange = (value: string) => {
    // Only allow numbers, commas, and dots
    if (!/^\d*[,.]?\d{0,2}$/.test(value)) return;

    const rawValue = value.replace(",",".");
    const numberValue = Number(rawValue);
    const purchaseNum = parseCurrency(purchaseValue);

    // Limit rules:
    // 1. Cannot exceed wallet balance
    // 2. Cannot exceed purchase value
    let allowedValue = numberValue;

    if (allowedValue > walletBalance) {
      allowedValue = walletBalance;
    }
    if (allowedValue > purchaseNum) {
      allowedValue = purchaseNum;
    }

    setCashbackToUse(value); // Keep raw input for display
  };

  const handleUseMax = () => {
    const purchaseNum = parseCurrency(purchaseValue);
    if (purchaseNum <= 0) return;

    const maxPossible = Math.min(walletBalance, purchaseNum);
    setCashbackToUse(formatCurrencyBr(maxPossible));
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate backend call
    setTimeout(() => {
      setIsSubmitting(false);
      setStep("waiting");
      
      // Call the onPaymentSimulated callback with actual numeric values
      onPaymentSimulated({
        purchaseAmount: parseCurrency(purchaseValue),
        cashbackUsed: parseCurrency(cashbackToUse),
      });
    }, 1500);
  };

  // --- Computed Values ---

  const numericPurchase = parseCurrency(purchaseValue);
  const numericCashbackToUse = parseCurrency(cashbackToUse);
  const amountToPay = Math.max(numericPurchase - numericCashbackToUse, 0);

  const isValid = 
    numericPurchase > 0 && 
    numericCashbackToUse >= 0 && 
    numericCashbackToUse <= walletBalance && 
    numericCashbackToUse <= numericPurchase && 
    !isSubmitting;

  // --- Renders ---

  if (step === "waiting") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
        <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mb-6 relative">
          <div className="absolute inset-0 rounded-full border-4 border-yellow-200 animate-ping opacity-75"></div>
          <Clock className="w-10 h-10 text-yellow-600" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Aguardando Lojista</h2>
        <p className="text-gray-500 text-sm text-center max-w-xs mb-8">
          O lojista recebeu uma notificação e precisa autorizar a transação.
        </p>

        <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-4">
            <Store className="w-5 h-5 text-gray-400" />
            <span className="font-bold text-gray-900">{storeName}</span>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total da Compra</span>
              <span className="font-medium text-gray-900">R$ {formatCurrencyBr(numericPurchase)}</span>
            </div>
            
            {numericCashbackToUse > 0 && (
              <div className="flex justify-between text-sm text-green-600 font-bold">
                <span>Saldo Utilizado</span>
                <span>- R$ {formatCurrencyBr(numericCashbackToUse)}</span>
              </div>
            )}

            <div className="flex justify-between items-center pt-2 border-t border-gray-50 mt-2">
              <span className="text-sm font-bold text-gray-700">A Pagar</span>
              <span className="text-xl font-black text-blue-600">R$ {formatCurrencyBr(amountToPay)}</span>
            </div>
          </div>
        </div>

        <button 
          onClick={() => onBack()} // Use the onBack prop to go back
          className="mt-8 text-sm font-bold text-gray-400 hover:text-gray-600"
        >
          Cancelar (simulação)
        </button>
      </div>
    );
  }

  return (
    <PayWithCashback 
      merchantName={storeName}
      merchantCashbackPercent={cashbackPercent}
      userBalance={walletBalance}
      purchaseValue={purchaseValue}
      balanceUse={cashbackToUse}
      isLoading={isSubmitting}
      onBack={onBack}
      onChangePurchaseValue={handlePurchaseChange}
      onChangeBalanceUse={handleCashbackChange}
      onConfirmPayment={handleSubmit}
    />
  );
}
