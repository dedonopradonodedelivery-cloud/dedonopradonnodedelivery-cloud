import { BannerItem } from '../types';

export const mockUserBanners: BannerItem[] = [
    {
        id: 'mock-user-banner-1',
        isUserBanner: true,
        target: 'mock-store-1',
        config: {
            type: 'template',
            template_id: 'oferta_relampago',
            headline: '50% OFF',
            subheadline: 'Tudo no App!',
            product_image_url: 'https://images.unsplash.com/photo-1585659722982-789600c7690a?q=80&w=600&auto=format&fit=crop'
        }
    },
    {
        id: 'mock-user-banner-2',
        isUserBanner: true,
        target: 'mock-store-2',
        config: {
            type: 'custom_editor',
            template_id: 'centered',
            background_color: '#111827',
            text_color: '#FFFFFF',
            font_size: 'medium',
            font_family: 'Outfit',
            title: 'Localizei JPA',
            subtitle: 'O super-app do seu bairro, agora com mock data!'
        }
    }
];
