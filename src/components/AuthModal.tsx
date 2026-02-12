import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import {
  X,
  Mail,
  Lock,
  User,
  Loader2,
  Store,
  Eye,
  EyeOff,
  CheckCircle2,
  Briefcase
} from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: SupabaseUser | null;
  signupContext?: 'default' | 'merchant_lead_qr';
  onLoginSuccess?: () => void;
}

const DISPOSABLE_DOMAINS = [
  'tempmail.com',
  '10minutemail.com',
  'guerrillamail.com',
  'yopmail.com',
  'mailinator.com',
  'throwawaymail.com',
];

const GoogleIcon: React.FC = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_2311_190)">
        <path d="M19.99 10.225C19.99 9.535 19.93 8.925 19.82 8.365H10.21V11.835H15.64C15.42 12.895 14.81 13.785 14.005 14.345V18.105H18.795C19.53 17.345 19.99 16.295 19.99 15.015C19.99 13.915 19.78 12.855 19.41 11.915C19.03 10.975 19.53 10.225 19.99 10.225Z" fill="#4285F4"/>
        <path d="M10.21 19.99C12.82 19.99 15.02 19.115 16.59 17.345L14.005 14.345C13.255 14.895 12.33 15.225 11.215 15.225C9.43 15.225 7.91 14.035 7.39 12.445H2.42V16.215C3.39 18.175 5.715 19.99 10.21 19.99Z" fill="#34A853"/>
        <path d="M5.005 12.445C4.765 11.755 4.645 10.975 4.645 10.225C4.645 9.475 4.765 8.695 5.005 8.005V4.235H0.035V8.005C-0.015 9.175 0.175 10.425 0.495 11.915C0.815 13.405 0.035 12.445 5.005 12.445Z" fill="#FBBC04"/>
        <path d="M10.21 4.645C12.1 4.645 13.625 5.395 14.855 6.495L17.41 4.235C15.545 2.505 13.065 0.015 10.21 0.015C5.715