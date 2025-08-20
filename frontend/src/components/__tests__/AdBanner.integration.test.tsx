import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import AdBanner from '../AdBanner';

describe('AdBanner Integration Tests', () => {
  beforeEach(() => {
    console.warn = vi.fn();
    console.error = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Integration', () => {
    it('renders successfully with all required elements', () => {
      render(<AdBanner />);
      
      // Should have both desktop and mobile swipers
      const swipers = screen.getAllByTestId('swiper');
      expect(swipers).toHaveLength(2);
      
      // Should have all advertisement slides (4 ads × 2 layouts = 8 slides)
      const slides = screen.getAllByTestId('swiper-slide');
      expect(slides).toHaveLength(8);
      
      // Should have all Learn More links
      const learnMoreLinks = screen.getAllByText('Learn More');
      expect(learnMoreLinks).toHaveLength(8);
      
      // Should have all ad images
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(8);
    });

    it('handles props correctly', () => {
      render(<AdBanner className="test-class" autoplay={false} autoplayDelay={3000} />);
      
      // Should apply custom className
      const banner = document.querySelector('.ad-banner.test-class');
      expect(banner).toBeInTheDocument();
      
      // Should have swipers with correct configuration
      const swipers = screen.getAllByTestId('swiper');
      swipers.forEach(swiper => {
        expect(swiper).toHaveAttribute('data-autoplay', 'false');
      });
    });

    it('maintains responsive layout structure', () => {
      render(<AdBanner />);
      
      // Desktop layout should be present
      const desktopLayout = document.querySelector('.hidden.lg\\:block');
      expect(desktopLayout).toBeInTheDocument();
      
      // Mobile layout should be present
      const mobileLayout = document.querySelector('.lg\\:hidden');
      expect(mobileLayout).toBeInTheDocument();
      
      // Desktop should have right positioning
      const desktopPositioning = document.querySelector('.fixed.right-4.top-1\\/2');
      expect(desktopPositioning).toBeInTheDocument();
      
      // Mobile should have top positioning
      const mobilePositioning = document.querySelector('.fixed.top-0.left-0.right-0');
      expect(mobilePositioning).toBeInTheDocument();
    });

    it('applies theme classes correctly', () => {
      render(<AdBanner />);
      
      // Should have light theme classes
      const lightElements = document.querySelectorAll('.bg-white, .text-slate-900');
      expect(lightElements.length).toBeGreaterThan(0);
      
      // Should have dark theme classes
      const darkElements = document.querySelectorAll('.dark\\:bg-slate-800, .dark\\:text-slate-100');
      expect(darkElements.length).toBeGreaterThan(0);
      
      // Should have neon hover effects
      const neonElements = document.querySelectorAll('.hover\\:text-neon, .hover\\:border-neon');
      expect(neonElements.length).toBeGreaterThan(0);
    });

    it('implements accessibility features', () => {
      render(<AdBanner />);
      
      // All images should have alt attributes
      const images = screen.getAllByRole('img');
      images.forEach(img => {
        expect(img).toHaveAttribute('alt');
        expect(img.getAttribute('alt')).toBeTruthy();
      });
      
      // All links should have proper attributes
      const links = screen.getAllByRole('link');
      links.forEach(link => {
        expect(link).toHaveAttribute('href');
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      });
    });

    it('handles performance optimizations', () => {
      render(<AdBanner />);
      
      // Images should use lazy loading
      const images = screen.getAllByRole('img');
      images.forEach(img => {
        expect(img).toHaveAttribute('loading', 'lazy');
      });
      
      // Should use performance-optimized CSS classes
      const transforms = document.querySelectorAll('.transform, .transition-transform');
      expect(transforms.length).toBeGreaterThan(0);
      
      // Should have proper z-index for layering
      const zIndexElements = document.querySelectorAll('.z-40');
      expect(zIndexElements.length).toBeGreaterThan(0);
    });
  });

  describe('Cross-Browser Compatibility', () => {
    it('uses cross-browser compatible CSS features', () => {
      render(<AdBanner />);
      
      // Should use flexbox (widely supported)
      const flexElements = document.querySelectorAll('.flex, .items-center, .justify-center');
      expect(flexElements.length).toBeGreaterThan(0);
      
      // Should use CSS transforms (hardware accelerated)
      const transformElements = document.querySelectorAll('.transform, .hover\\:scale-105');
      expect(transformElements.length).toBeGreaterThan(0);
      
      // Should use modern CSS gradients
      const gradientElements = document.querySelectorAll('.bg-gradient-to-r, .bg-gradient-to-b');
      expect(gradientElements.length).toBeGreaterThan(0);
    });

    it('provides fallback behavior', () => {
      render(<AdBanner />);
      
      // Component should render without JavaScript-dependent features failing
      const banner = document.querySelector('.ad-banner');
      expect(banner).toBeInTheDocument();
      
      // Should have static content that works without JS
      const staticContent = screen.getAllByText('Learn More');
      expect(staticContent.length).toBeGreaterThan(0);
    });
  });

  describe('Error Resilience', () => {
    it('continues to function with console errors mocked', () => {
      // Mock console methods to simulate error conditions
      const originalError = console.error;
      console.error = vi.fn();
      
      render(<AdBanner />);
      
      // Component should still render
      const swipers = screen.getAllByTestId('swiper');
      expect(swipers).toHaveLength(2);
      
      // Restore console
      console.error = originalError;
    });

    it('handles missing or invalid props gracefully', () => {
      // Test with undefined props
      render(<AdBanner className={undefined} autoplay={undefined} />);
      
      const swipers = screen.getAllByTestId('swiper');
      expect(swipers).toHaveLength(2);
      
      // Should still have default behavior
      const banner = document.querySelector('.ad-banner');
      expect(banner).toBeInTheDocument();
    });
  });

  describe('Real-world Usage Scenarios', () => {
    it('works in a typical page layout', () => {
      const { container } = render(
        <div className="min-h-screen bg-gray-100">
          <header className="h-16 bg-white shadow">Header</header>
          <main className="container mx-auto px-4 py-8">
            <h1>Main Content</h1>
            <p>This is the main page content.</p>
          </main>
          <AdBanner />
          <footer className="h-16 bg-gray-800 text-white">Footer</footer>
        </div>
      );
      
      // Banner should be present and positioned correctly
      const banner = container.querySelector('.ad-banner');
      expect(banner).toBeInTheDocument();
      
      // Should not interfere with other page elements
      const header = screen.getByText('Header');
      const footer = screen.getByText('Footer');
      expect(header).toBeInTheDocument();
      expect(footer).toBeInTheDocument();
    });

    it('maintains functionality when re-rendered', () => {
      const { rerender } = render(<AdBanner autoplay={true} />);
      
      let swipers = screen.getAllByTestId('swiper');
      expect(swipers).toHaveLength(2);
      
      // Re-render with different props
      rerender(<AdBanner autoplay={false} className="updated" />);
      
      swipers = screen.getAllByTestId('swiper');
      expect(swipers).toHaveLength(2);
      
      // Should have updated className
      const banner = document.querySelector('.ad-banner.updated');
      expect(banner).toBeInTheDocument();
    });
  });
});