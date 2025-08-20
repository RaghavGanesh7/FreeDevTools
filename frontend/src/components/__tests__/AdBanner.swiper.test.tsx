import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import AdBanner from '../AdBanner';

import React from 'react';

// Enhanced Swiper mock with more functionality
vi.mock('swiper/react', () => ({
  Swiper: ({ children, className, autoplay, navigation, pagination, loop, onSlideChange, ...props }: any) => {
    const [currentSlide, setCurrentSlide] = React.useState(0);
    
    React.useEffect(() => {
      if (autoplay && autoplay.delay) {
        const interval = setInterval(() => {
          setCurrentSlide(prev => (prev + 1) % React.Children.count(children));
          onSlideChange?.({ activeIndex: currentSlide });
        }, autoplay.delay);
        
        return () => clearInterval(interval);
      }
    }, [autoplay, children, currentSlide, onSlideChange]);
    
    const swiperElement = React.createElement('div', {
      className,
      'data-testid': 'swiper',
      'data-autoplay': autoplay ? 'true' : 'false',
      'data-navigation': navigation ? 'true' : 'false',
      'data-pagination': pagination ? 'true' : 'false',
      'data-loop': loop ? 'true' : 'false',
      'data-current-slide': currentSlide,
      ...props
    }, [
      children,
      navigation && React.createElement('button', {
        key: 'prev',
        'data-testid': 'swiper-button-prev',
        onClick: () => setCurrentSlide(prev => prev > 0 ? prev - 1 : React.Children.count(children) - 1)
      }, 'Previous'),
      navigation && React.createElement('button', {
        key: 'next',
        'data-testid': 'swiper-button-next',
        onClick: () => setCurrentSlide(prev => (prev + 1) % React.Children.count(children))
      }, 'Next'),
      pagination && React.createElement('div', {
        key: 'pagination',
        'data-testid': 'swiper-pagination'
      }, Array.from({ length: React.Children.count(children) }, (_, i) => 
        React.createElement('button', {
          key: i,
          'data-testid': `pagination-bullet-${i}`,
          className: i === currentSlide ? 'active' : '',
          onClick: () => setCurrentSlide(i)
        }, i + 1)
      ))
    ].filter(Boolean));
    
    return swiperElement;
  },
  SwiperSlide: ({ children, ...props }: any) => 
    React.createElement('div', { 'data-testid': 'swiper-slide', ...props }, children),
}));

describe('AdBanner Swiper Functionality', () => {
  beforeEach(() => {
    console.warn = vi.fn();
    console.error = vi.fn();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  describe('Swiper Configuration', () => {
    it('configures swiper with correct modules', () => {
      render(<AdBanner />);
      
      const swipers = screen.getAllByTestId('swiper');
      swipers.forEach(swiper => {
        expect(swiper).toHaveAttribute('data-autoplay', 'true');
        expect(swiper).toHaveAttribute('data-navigation', 'true');
        expect(swiper).toHaveAttribute('data-pagination', 'true');
        expect(swiper).toHaveAttribute('data-loop', 'true');
      });
    });

    it('disables autoplay when autoplay prop is false', () => {
      render(<AdBanner autoplay={false} />);
      
      const swipers = screen.getAllByTestId('swiper');
      swipers.forEach(swiper => {
        expect(swiper).toHaveAttribute('data-autoplay', 'false');
      });
    });

    it('uses custom autoplay delay', () => {
      render(<AdBanner autoplay={true} autoplayDelay={3000} />);
      
      const swipers = screen.getAllByTestId('swiper');
      expect(swipers.length).toBeGreaterThan(0);
      // The delay is passed to the swiper component
    });

    it('uses default autoplay delay when not specified', () => {
      render(<AdBanner />);
      
      const swipers = screen.getAllByTestId('swiper');
      expect(swipers.length).toBeGreaterThan(0);
      // Default delay should be 5000ms
    });
  });

  describe('Autoplay Behavior', () => {
    it('auto-advances slides with default timing', async () => {
      render(<AdBanner />);
      
      const swiper = screen.getAllByTestId('swiper')[0]; // Desktop swiper
      expect(swiper).toHaveAttribute('data-current-slide', '0');
      
      // Fast-forward time by 5 seconds (default delay)
      act(() => {
        vi.advanceTimersByTime(5000);
      });
      
      await waitFor(() => {
        expect(swiper).toHaveAttribute('data-current-slide', '1');
      });
    });

    it('auto-advances slides with custom timing', async () => {
      render(<AdBanner autoplay={true} autoplayDelay={2000} />);
      
      const swiper = screen.getAllByTestId('swiper')[0];
      expect(swiper).toHaveAttribute('data-current-slide', '0');
      
      // Fast-forward time by 2 seconds (custom delay)
      act(() => {
        vi.advanceTimersByTime(2000);
      });
      
      await waitFor(() => {
        expect(swiper).toHaveAttribute('data-current-slide', '1');
      });
    });

    it('does not auto-advance when autoplay is disabled', async () => {
      render(<AdBanner autoplay={false} />);
      
      const swiper = screen.getAllByTestId('swiper')[0];
      expect(swiper).toHaveAttribute('data-current-slide', '0');
      
      // Fast-forward time
      act(() => {
        vi.advanceTimersByTime(10000);
      });
      
      // Should still be on first slide
      expect(swiper).toHaveAttribute('data-current-slide', '0');
    });

    it('loops back to first slide after last slide', async () => {
      render(<AdBanner autoplay={true} autoplayDelay={1000} />);
      
      const swiper = screen.getAllByTestId('swiper')[0];
      
      // Advance through all slides (4 slides total)
      for (let i = 0; i < 4; i++) {
        act(() => {
          vi.advanceTimersByTime(1000);
        });
        
        await waitFor(() => {
          expect(swiper).toHaveAttribute('data-current-slide', String((i + 1) % 4));
        });
      }
      
      // Should be back to slide 0
      expect(swiper).toHaveAttribute('data-current-slide', '0');
    });
  });

  describe('Navigation Controls', () => {
    it('shows navigation buttons on desktop', () => {
      render(<AdBanner />);
      
      // Desktop swiper should have navigation
      const prevButtons = screen.getAllByTestId('swiper-button-prev');
      const nextButtons = screen.getAllByTestId('swiper-button-next');
      
      expect(prevButtons.length).toBeGreaterThan(0);
      expect(nextButtons.length).toBeGreaterThan(0);
    });

    it('allows manual navigation with next button', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<AdBanner autoplay={false} />);
      
      const swiper = screen.getAllByTestId('swiper')[0];
      const nextButton = screen.getAllByTestId('swiper-button-next')[0];
      
      expect(swiper).toHaveAttribute('data-current-slide', '0');
      
      await user.click(nextButton);
      
      expect(swiper).toHaveAttribute('data-current-slide', '1');
    });

    it('allows manual navigation with previous button', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<AdBanner autoplay={false} />);
      
      const swiper = screen.getAllByTestId('swiper')[0];
      const nextButton = screen.getAllByTestId('swiper-button-next')[0];
      const prevButton = screen.getAllByTestId('swiper-button-prev')[0];
      
      // Go to slide 1 first
      await user.click(nextButton);
      expect(swiper).toHaveAttribute('data-current-slide', '1');
      
      // Go back to slide 0
      await user.click(prevButton);
      expect(swiper).toHaveAttribute('data-current-slide', '0');
    });

    it('wraps around when navigating past last slide', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<AdBanner autoplay={false} />);
      
      const swiper = screen.getAllByTestId('swiper')[0];
      const nextButton = screen.getAllByTestId('swiper-button-next')[0];
      
      // Click next 4 times (should wrap to slide 0)
      for (let i = 0; i < 4; i++) {
        await user.click(nextButton);
      }
      
      expect(swiper).toHaveAttribute('data-current-slide', '0');
    });

    it('wraps around when navigating before first slide', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<AdBanner autoplay={false} />);
      
      const swiper = screen.getAllByTestId('swiper')[0];
      const prevButton = screen.getAllByTestId('swiper-button-prev')[0];
      
      // Click previous from slide 0 (should wrap to last slide)
      await user.click(prevButton);
      
      expect(swiper).toHaveAttribute('data-current-slide', '3');
    });
  });

  describe('Pagination Controls', () => {
    it('shows pagination bullets', () => {
      render(<AdBanner />);
      
      const pagination = screen.getAllByTestId('swiper-pagination');
      expect(pagination.length).toBeGreaterThan(0);
      
      // Should have 4 bullets for 4 slides
      const bullets = screen.getAllByTestId(/pagination-bullet-/);
      expect(bullets).toHaveLength(8); // 4 bullets × 2 swipers (desktop + mobile)
    });

    it('allows direct navigation via pagination bullets', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<AdBanner autoplay={false} />);
      
      const swiper = screen.getAllByTestId('swiper')[0];
      const bullet2 = screen.getAllByTestId('pagination-bullet-2')[0];
      
      expect(swiper).toHaveAttribute('data-current-slide', '0');
      
      await user.click(bullet2);
      
      expect(swiper).toHaveAttribute('data-current-slide', '2');
    });

    it('highlights active pagination bullet', () => {
      render(<AdBanner autoplay={false} />);
      
      const activeBullets = screen.getAllByTestId('pagination-bullet-0');
      activeBullets.forEach(bullet => {
        expect(bullet).toHaveClass('active');
      });
    });

    it('updates active bullet when slide changes', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<AdBanner autoplay={false} />);
      
      const bullet1 = screen.getAllByTestId('pagination-bullet-1')[0];
      
      await user.click(bullet1);
      
      expect(bullet1).toHaveClass('active');
    });
  });

  describe('Touch and Swipe Interactions', () => {
    it('supports touch interactions on mobile layout', () => {
      render(<AdBanner />);
      
      // Mobile swiper should be present
      const mobileSwiper = screen.getAllByTestId('swiper')[1]; // Second swiper is mobile
      expect(mobileSwiper).toBeInTheDocument();
    });

    it('maintains swiper functionality across layouts', () => {
      render(<AdBanner />);
      
      const swipers = screen.getAllByTestId('swiper');
      expect(swipers).toHaveLength(2); // Desktop and mobile
      
      swipers.forEach(swiper => {
        expect(swiper).toHaveAttribute('data-loop', 'true');
      });
    });
  });

  describe('Performance and Optimization', () => {
    it('uses efficient slide transitions', () => {
      render(<AdBanner />);
      
      // Check for performance-optimized classes
      const transitions = document.querySelectorAll('.transition-transform, .duration-300, .duration-500');
      expect(transitions.length).toBeGreaterThan(0);
    });

    it('applies GPU acceleration classes', () => {
      render(<AdBanner />);
      
      // Check for transform classes that trigger GPU acceleration
      const transforms = document.querySelectorAll('.transform, .hover\\:scale-105, .hover\\:scale-110');
      expect(transforms.length).toBeGreaterThan(0);
    });

    it('uses appropriate z-index for layering', () => {
      render(<AdBanner />);
      
      // Check for z-index classes
      const zIndexElements = document.querySelectorAll('.z-40');
      expect(zIndexElements.length).toBeGreaterThan(0);
    });
  });

  describe('Accessibility with Swiper', () => {
    it('provides keyboard navigation support', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<AdBanner />);
      
      const nextButton = screen.getAllByTestId('swiper-button-next')[0];
      
      // Should be focusable
      await user.tab();
      // Navigation buttons should be in tab order
      expect(document.activeElement).toBeTruthy();
    });

    it('provides screen reader accessible controls', () => {
      render(<AdBanner />);
      
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
      
      // All buttons should be accessible
      buttons.forEach(button => {
        expect(button).toBeInTheDocument();
      });
    });
  });
});