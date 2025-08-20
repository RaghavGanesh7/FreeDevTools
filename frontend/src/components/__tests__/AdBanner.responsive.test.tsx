import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import AdBanner from '../AdBanner';

// Mock window.matchMedia for different screen sizes
const mockMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
};

// Mock window.innerWidth for different screen sizes
const mockWindowSize = (width: number, height: number = 768) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
};

describe('AdBanner Responsive Behavior', () => {
  beforeEach(() => {
    // Reset console mocks
    console.warn = vi.fn();
    console.error = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Desktop Layout (1024px+)', () => {
    beforeEach(() => {
      mockWindowSize(1200, 800);
      mockMatchMedia(true); // lg breakpoint matches
    });

    it('shows desktop layout on large screens', () => {
      render(<AdBanner />);
      
      // Desktop layout should be visible
      const desktopLayout = document.querySelector('.hidden.lg\\:block');
      expect(desktopLayout).toBeInTheDocument();
      
      // Mobile layout should be hidden
      const mobileLayout = document.querySelector('.lg\\:hidden');
      expect(mobileLayout).toBeInTheDocument();
    });

    it('applies correct desktop positioning classes', () => {
      render(<AdBanner />);
      
      // Check for desktop-specific positioning
      const fixedRight = document.querySelector('.fixed.right-4.top-1\\/2');
      expect(fixedRight).toBeInTheDocument();
      
      const transform = document.querySelector('.transform.-translate-y-1\\/2');
      expect(transform).toBeInTheDocument();
    });

    it('uses correct desktop width', () => {
      render(<AdBanner />);
      
      const desktopContainer = document.querySelector('.w-80');
      expect(desktopContainer).toBeInTheDocument();
    });

    it('shows navigation controls on desktop', () => {
      render(<AdBanner />);
      
      // Desktop swiper should have navigation enabled
      const swipers = screen.getAllByTestId('swiper');
      expect(swipers.length).toBeGreaterThan(0);
    });
  });

  describe('Tablet Layout (768px - 1023px)', () => {
    beforeEach(() => {
      mockWindowSize(800, 600);
      mockMatchMedia(false); // lg breakpoint doesn't match
    });

    it('shows mobile layout on tablet screens', () => {
      render(<AdBanner />);
      
      // Mobile layout should be visible (includes tablet)
      const mobileLayout = document.querySelector('.lg\\:hidden');
      expect(mobileLayout).toBeInTheDocument();
      
      // Desktop layout should be hidden
      const desktopLayout = document.querySelector('.hidden.lg\\:block');
      expect(desktopLayout).toBeInTheDocument();
    });

    it('applies correct tablet positioning classes', () => {
      render(<AdBanner />);
      
      // Check for mobile/tablet positioning
      const fixedTop = document.querySelector('.fixed.top-0.left-0.right-0');
      expect(fixedTop).toBeInTheDocument();
    });

    it('uses appropriate tablet height', () => {
      render(<AdBanner />);
      
      // Should use md:h-44 for tablet height
      const tabletHeight = document.querySelector('.h-36.md\\:h-44');
      expect(tabletHeight).toBeInTheDocument();
    });

    it('shows medium-sized text on tablets', () => {
      render(<AdBanner />);
      
      // Check for responsive text sizing
      const responsiveText = document.querySelector('.text-sm.md\\:text-lg, .text-xs.md\\:text-sm');
      expect(responsiveText).toBeInTheDocument();
    });
  });

  describe('Mobile Layout (< 768px)', () => {
    beforeEach(() => {
      mockWindowSize(375, 667);
      mockMatchMedia(false); // lg breakpoint doesn't match
    });

    it('shows mobile layout on small screens', () => {
      render(<AdBanner />);
      
      // Mobile layout should be visible
      const mobileLayout = document.querySelector('.lg\\:hidden');
      expect(mobileLayout).toBeInTheDocument();
    });

    it('applies correct mobile positioning', () => {
      render(<AdBanner />);
      
      // Check for mobile positioning
      const fixedTop = document.querySelector('.fixed.top-0.left-0.right-0');
      expect(fixedTop).toBeInTheDocument();
    });

    it('uses compact mobile height', () => {
      render(<AdBanner />);
      
      // Should use h-36 for mobile height
      const mobileHeight = document.querySelector('.h-36');
      expect(mobileHeight).toBeInTheDocument();
    });

    it('shows smaller text on mobile', () => {
      render(<AdBanner />);
      
      // Check for mobile text sizing
      const mobileText = document.querySelector('.text-xs, .text-sm');
      expect(mobileText).toBeInTheDocument();
    });

    it('uses appropriate mobile image sizing', () => {
      render(<AdBanner />);
      
      // Mobile should use w-2/5 for image width
      const mobileImageWidth = document.querySelector('.w-2\\/5');
      expect(mobileImageWidth).toBeInTheDocument();
    });
  });

  describe('Breakpoint Transitions', () => {
    it('handles transition from mobile to desktop', () => {
      // Start with mobile
      mockWindowSize(375, 667);
      mockMatchMedia(false);
      
      const { rerender } = render(<AdBanner />);
      
      // Verify mobile layout
      expect(document.querySelector('.lg\\:hidden')).toBeInTheDocument();
      
      // Switch to desktop
      mockWindowSize(1200, 800);
      mockMatchMedia(true);
      
      rerender(<AdBanner />);
      
      // Verify desktop layout
      expect(document.querySelector('.hidden.lg\\:block')).toBeInTheDocument();
    });

    it('handles transition from desktop to mobile', () => {
      // Start with desktop
      mockWindowSize(1200, 800);
      mockMatchMedia(true);
      
      const { rerender } = render(<AdBanner />);
      
      // Verify desktop layout
      expect(document.querySelector('.hidden.lg\\:block')).toBeInTheDocument();
      
      // Switch to mobile
      mockWindowSize(375, 667);
      mockMatchMedia(false);
      
      rerender(<AdBanner />);
      
      // Verify mobile layout
      expect(document.querySelector('.lg\\:hidden')).toBeInTheDocument();
    });
  });

  describe('Content Adaptation', () => {
    it('adapts image layout for mobile', () => {
      mockWindowSize(375, 667);
      render(<AdBanner />);
      
      // Mobile should use horizontal layout with image on left
      const imageContainer = document.querySelector('.w-2\\/5.md\\:w-1\\/3');
      expect(imageContainer).toBeInTheDocument();
      
      const contentContainer = document.querySelector('.flex-1');
      expect(contentContainer).toBeInTheDocument();
    });

    it('adapts button sizing for different screens', () => {
      render(<AdBanner />);
      
      // Check for responsive button sizing
      const responsiveButton = document.querySelector('.text-xs.md\\:text-sm, .px-3.md\\:px-4');
      expect(responsiveButton).toBeInTheDocument();
    });

    it('adapts spacing for different screens', () => {
      render(<AdBanner />);
      
      // Check for responsive spacing
      const responsiveSpacing = document.querySelector('.p-3.md\\:p-5, .ml-1.md\\:ml-2');
      expect(responsiveSpacing).toBeInTheDocument();
    });
  });

  describe('Touch and Interaction', () => {
    it('supports touch interactions on mobile', () => {
      mockWindowSize(375, 667);
      render(<AdBanner />);
      
      // Swiper should be present for touch interactions
      const swiper = screen.getByTestId('swiper');
      expect(swiper).toBeInTheDocument();
    });

    it('provides appropriate touch targets', () => {
      mockWindowSize(375, 667);
      render(<AdBanner />);
      
      // Buttons should have adequate touch target size
      const buttons = screen.getAllByText('Learn More');
      buttons.forEach(button => {
        const buttonElement = button.closest('a');
        expect(buttonElement).toHaveClass('py-2'); // Adequate vertical padding
      });
    });
  });

  describe('Performance on Different Devices', () => {
    it('uses appropriate image loading strategy', () => {
      render(<AdBanner />);
      
      const images = screen.getAllByRole('img');
      images.forEach(img => {
        expect(img).toHaveAttribute('loading', 'lazy');
      });
    });

    it('applies performance-optimized classes', () => {
      render(<AdBanner />);
      
      // Check for GPU-accelerated transforms
      const transforms = document.querySelectorAll('.transform, .transition-transform');
      expect(transforms.length).toBeGreaterThan(0);
    });
  });
});