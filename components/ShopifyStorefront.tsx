import React, { useEffect, useState } from 'react';

interface ShopifyStorefrontProps {
  isVisible: boolean;
  onClose: () => void;
}

declare global {
  interface Window {
    ShopifyBuy: any;
  }
}

export default function ShopifyStorefront({ isVisible, onClose }: ShopifyStorefrontProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [shopifyLoaded, setShopifyLoaded] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Track if component has ever been visible for smooth animations
  useEffect(() => {
    if (isVisible && !hasBeenVisible) {
      setHasBeenVisible(true);
    }
  }, [isVisible, hasBeenVisible]);

  // Handle scroll animations for both opening and closing
  useEffect(() => {
    if (!shopifyLoaded) return;

    const scrollContainer = document.querySelector('.store-scroll-container') as HTMLElement;
    if (!scrollContainer) return;

    setIsAnimating(true);

    if (isVisible) {
      // Opening: scroll from bottom to top
      setTimeout(() => {
        const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
        scrollContainer.scrollTop = maxScroll; // Start at bottom
        
        const startTime = Date.now();
        const animateScrollUp = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / 1100, 1); // 1100ms - definitely finishes after panel opens
          
          // Use CSS ease-in-out equivalent curve for smooth motion
          const easeInOut = progress < 0.5 
            ? 2 * progress * progress 
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;
          
          const currentScroll = maxScroll * (1 - easeInOut);
          scrollContainer.scrollTop = currentScroll;
          
          if (progress < 1) {
            requestAnimationFrame(animateScrollUp);
          } else {
            setIsAnimating(false);
          }
        };
        
        requestAnimationFrame(animateScrollUp);
      }, 50); // Small delay to ensure content is loaded
    } else {
      // Closing: scroll from top to bottom
      const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
      scrollContainer.scrollTop = 0; // Start at top
      
      const startTime = Date.now();
      const animateScrollDown = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / 1500, 1); // 1500ms - very gradual trailing effect
        
        // Use CSS ease-in-out equivalent curve for smooth motion
        const easeInOut = progress < 0.5 
          ? 2 * progress * progress 
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        
        const currentScroll = maxScroll * easeInOut;
        scrollContainer.scrollTop = currentScroll;
        
        if (progress < 1) {
          requestAnimationFrame(animateScrollDown);
        } else {
          setIsAnimating(false);
        }
      };
      
      requestAnimationFrame(animateScrollDown);
    }
  }, [isVisible, shopifyLoaded]);

  // Preload store content when component first mounts (before animations)
  useEffect(() => {
    if (!hasBeenVisible) return;

    // Preload Shopify content immediately
    const loadShopifySDK = () => {
      if (window.ShopifyBuy) {
        initializeShopify();
        return;
      }

      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
      script.onload = initializeShopify;
      document.head.appendChild(script);
    };

    const initializeShopify = () => {
      if (!window.ShopifyBuy || !window.ShopifyBuy.UI) return;

      const client = window.ShopifyBuy.buildClient({
        domain: 'fdd4ab.myshopify.com',
        storefrontAccessToken: '9d37a35bd39a0ac9da70078f3edff38f',
      });

      window.ShopifyBuy.UI.onReady(client).then((ui: any) => {
        const container = document.getElementById('collection-component-1751939732833');
        if (container) {
          container.innerHTML = '';
        }

        ui.createComponent('collection', {
          id: '458732077367',
          node: container,
          moneyFormat: '%24%7B%7Bamount%7D%7D',
          options: {
            "product": {
              "styles": {
                "product": {
                  "@media (min-width: 601px)": {
                    "max-width": "calc(25% - 20px)",
                    "margin-left": "20px",
                    "margin-bottom": "50px",
                    "width": "calc(25% - 20px)"
                  },
                  "img": {
                    "height": "calc(100% - 15px)",
                    "position": "absolute",
                    "left": "0",
                    "right": "0",
                    "top": "0"
                  },
                  "imgWrapper": {
                    "padding-top": "calc(75% + 15px)",
                    "position": "relative",
                    "height": "0"
                  }
                },
                "title": {
                  "font-family": "Lato, sans-serif",
                  "color": "#ffffff"
                },
                "button": {
                  "font-family": "Geneva, sans-serif",
                  ":hover": {
                    "background-color": "#dd3a25"
                  },
                  "background-color": "#f54029",
                  ":focus": {
                    "background-color": "#dd3a25"
                  },
                  "border-radius": "7px"
                },
                "price": {
                  "font-family": "Lato, sans-serif",
                  "font-size": "17px",
                  "color": "#ffffff"
                },
                "compareAt": {
                  "font-family": "Lato, sans-serif",
                  "font-size": "14.45px",
                  "color": "#ffffff"
                },
                "unitPrice": {
                  "font-family": "Lato, sans-serif",
                  "font-size": "14.45px",
                  "color": "#ffffff"
                }
              },
              "contents": {
                "button": false,
                "buttonWithQuantity": true
              },
              "text": {
                "button": "Add to cart"
              },
              "googleFonts": [
                "Lato"
              ]
            },
            "productSet": {
              "styles": {
                "products": {
                  "@media (min-width: 601px)": {
                    "margin-left": "-20px"
                  }
                }
              }
            },
            "modalProduct": {
              "contents": {
                "img": false,
                "imgWithCarousel": true,
                "button": false,
                "buttonWithQuantity": true
              },
              "styles": {
                "product": {
                  "@media (min-width: 601px)": {
                    "max-width": "100%",
                    "margin-left": "0px",
                    "margin-bottom": "0px"
                  }
                },
                "button": {
                  "font-family": "Geneva, sans-serif",
                  ":hover": {
                    "background-color": "#dd3a25"
                  },
                  "background-color": "#f54029",
                  ":focus": {
                    "background-color": "#dd3a25"
                  },
                  "border-radius": "7px"
                },
                "title": {
                  "font-family": "Helvetica Neue, sans-serif",
                  "font-weight": "bold",
                  "font-size": "26px",
                  "color": "#4c4c4c"
                },
                "price": {
                  "font-family": "Helvetica Neue, sans-serif",
                  "font-weight": "normal",
                  "font-size": "18px",
                  "color": "#4c4c4c"
                },
                "compareAt": {
                  "font-family": "Helvetica Neue, sans-serif",
                  "font-weight": "normal",
                  "font-size": "15.299999999999999px",
                  "color": "#4c4c4c"
                },
                "unitPrice": {
                  "font-family": "Helvetica Neue, sans-serif",
                  "font-weight": "normal",
                  "font-size": "15.299999999999999px",
                  "color": "#4c4c4c"
                }
              },
              "text": {
                "button": "Add to cart"
              }
            },
            "option": {
              "styles": {
                "label": {
                  "font-family": "Lato, sans-serif",
                  "font-size": "15px",
                  "color": "#f54029"
                },
                "select": {
                  "font-family": "Lato, sans-serif"
                }
              },
              "googleFonts": [
                "Lato"
              ]
            },
            "cart": {
              "styles": {
                "button": {
                  "font-family": "Geneva, sans-serif",
                  ":hover": {
                    "background-color": "#dd3a25"
                  },
                  "background-color": "#f54029",
                  ":focus": {
                    "background-color": "#dd3a25"
                  },
                  "border-radius": "7px"
                }
              },
              "text": {
                "total": "Subtotal",
                "button": "Checkout"
              }
            },
            "toggle": {
              "styles": {
                "toggle": {
                  "font-family": "Geneva, sans-serif",
                  "background-color": "#f54029",
                  ":hover": {
                    "background-color": "#dd3a25"
                  },
                  ":focus": {
                    "background-color": "#dd3a25"
                  }
                }
              }
            }
          }
        });

        setIsLoading(false);
        setShopifyLoaded(true);
      });
    };

    loadShopifySDK();
  }, [hasBeenVisible]);

  // Apply proper glass morphism styling to match SelectionBar
  useEffect(() => {
    if (shopifyLoaded) {
      const applyGlassMorphism = () => {
        const container = document.getElementById('collection-component-1751939732833');
        if (!container) return;

        // Apply glass morphism to all images
        const images = container.querySelectorAll('img');
        images.forEach(img => {
          const htmlImg = img as HTMLImageElement;
          htmlImg.style.borderRadius = '12px';
          htmlImg.style.boxShadow = '0px 4px 12px rgba(0, 0, 0, 0.2)';
          htmlImg.style.transition = 'all 0.3s ease';
        });

        // Apply glass morphism to all buttons
        const buttons = container.querySelectorAll('button, [type="button"], input[type="submit"]');
        buttons.forEach(btn => {
          const htmlBtn = btn as HTMLElement;
          // Use the same glass pattern as SelectionBar but with red theme
          htmlBtn.style.background = 'rgba(220, 38, 38, 0.3)'; // red-700 equivalent
          htmlBtn.style.backdropFilter = 'blur(12px)';
          htmlBtn.style.setProperty('-webkit-backdrop-filter', 'blur(12px)');
          htmlBtn.style.border = '1px solid rgba(255, 255, 255, 0.2)';
          htmlBtn.style.borderRadius = '8px';
          htmlBtn.style.boxShadow = '0px 4px 12px rgba(0, 0, 0, 0.2)';
          htmlBtn.style.color = 'white';
          htmlBtn.style.fontWeight = '600';
          htmlBtn.style.textShadow = '0 1px 2px rgba(0, 0, 0, 0.3)';
          htmlBtn.style.transition = 'all 0.3s ease';
          
          // Add hover effect
          htmlBtn.addEventListener('mouseenter', () => {
            htmlBtn.style.transform = 'scale(1.05)';
            htmlBtn.style.boxShadow = '0px 2px 5px rgba(0, 0, 0, 0.2)';
          });
          
          htmlBtn.addEventListener('mouseleave', () => {
            htmlBtn.style.transform = 'scale(1)';
            htmlBtn.style.boxShadow = '0px 4px 12px rgba(0, 0, 0, 0.2)';
          });
        });

        // Apply glass morphism to all select elements
        const selects = container.querySelectorAll('select');
        selects.forEach(select => {
          const htmlSelect = select as HTMLSelectElement;
          htmlSelect.style.background = 'rgba(220, 38, 38, 0.3)';
          htmlSelect.style.backdropFilter = 'blur(12px)';
          htmlSelect.style.setProperty('-webkit-backdrop-filter', 'blur(12px)');
          htmlSelect.style.border = '1px solid rgba(255, 255, 255, 0.2)';
          htmlSelect.style.borderRadius = '8px';
          htmlSelect.style.color = 'white';
          htmlSelect.style.padding = '8px 12px';
          htmlSelect.style.fontWeight = '500';
          htmlSelect.style.boxShadow = '0px 4px 12px rgba(0, 0, 0, 0.2)';
          htmlSelect.style.transition = 'all 0.3s ease';
        });

        // Apply glass morphism to all input fields
        const inputs = container.querySelectorAll('input:not([type="submit"]):not([type="button"])');
        inputs.forEach(input => {
          const htmlInput = input as HTMLInputElement;
          htmlInput.style.background = 'rgba(220, 38, 38, 0.3)';
          htmlInput.style.backdropFilter = 'blur(12px)';
          htmlInput.style.setProperty('-webkit-backdrop-filter', 'blur(12px)');
          htmlInput.style.border = '1px solid rgba(255, 255, 255, 0.2)';
          htmlInput.style.borderRadius = '8px';
          htmlInput.style.color = 'white';
          htmlInput.style.padding = '8px 12px';
          htmlInput.style.boxShadow = '0px 4px 12px rgba(0, 0, 0, 0.2)';
          htmlInput.style.transition = 'all 0.3s ease';
        });

        // Apply glass morphism to product containers
        const products = container.querySelectorAll('div');
        products.forEach(div => {
          const htmlDiv = div as HTMLDivElement;
          // Only apply to elements that look like product cards
          if (htmlDiv.querySelector('img') && htmlDiv.querySelector('button')) {
            htmlDiv.style.background = 'rgba(220, 38, 38, 0.3)';
            htmlDiv.style.backdropFilter = 'blur(12px)';
            htmlDiv.style.setProperty('-webkit-backdrop-filter', 'blur(12px)');
            htmlDiv.style.border = '1px solid rgba(255, 255, 255, 0.2)';
            htmlDiv.style.borderRadius = '12px';
            htmlDiv.style.boxShadow = '0px 4px 12px rgba(0, 0, 0, 0.2)';
            htmlDiv.style.transition = 'all 0.3s ease';
            htmlDiv.style.padding = '16px';
            htmlDiv.style.margin = '16px';
          }
        });

        // Style text elements
        const titles = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
        titles.forEach(title => {
          const htmlTitle = title as HTMLElement;
          htmlTitle.style.color = 'white';
          htmlTitle.style.textShadow = '0 1px 2px rgba(0, 0, 0, 0.3)';
          htmlTitle.style.fontWeight = '600';
        });
      };

      // Apply styles immediately and also watch for new elements
      applyGlassMorphism();
      
      // Use MutationObserver to watch for new elements added by Shopify
      const observer = new MutationObserver(() => {
        applyGlassMorphism();
      });
      
      const container = document.getElementById('collection-component-1751939732833');
      if (container) {
        observer.observe(container, { 
          childList: true, 
          subtree: true 
        });
      }

      // Also apply styles periodically in case elements are added dynamically
      const interval = setInterval(applyGlassMorphism, 1000);

      return () => {
        observer.disconnect();
        clearInterval(interval);
      };
    }
  }, [shopifyLoaded]);

  // Don't render until first time visible (for smooth slide-in animation)
  if (!hasBeenVisible && !isVisible) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex"
      style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
    >
      {/* Backdrop */}
      {isVisible && (
        <div 
          className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={onClose}
          style={{ zIndex: 10 }}
        />
      )}
      
      {/* Header - Slides down from above synchronized with panel */}
      <div 
        className={`fixed top-0 left-0 right-0 flex items-center px-8 py-4 w-full backdrop-filter backdrop-blur-md bg-red-700 bg-opacity-30 shadow-lg transition-transform duration-500 ease-in-out ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
        style={{
          height: '70px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          zIndex: 30
        }}
      >
        <div className="flex items-center space-x-3">
          <img src="/Medallions/TUC.png" alt="TUC Store" className="h-10 w-10 rounded-full shadow-lg" />
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold text-white" style={{ 
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
              letterSpacing: '0.5px',
              lineHeight: '1.2'
            }}>The Utility Co Store</h2>
            <a 
              href="https://shop.theutilitycompany.co" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-white opacity-70 hover:opacity-100 transition-opacity duration-200"
              style={{
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                letterSpacing: '0.3px',
                textDecoration: 'none',
                marginTop: '1px'
              }}
            >
              shop.theutilitycompany.co →
            </a>
          </div>
        </div>
      </div>
      
      {/* Slideout Panel */}
      <div className={`fixed top-0 left-0 h-full shadow-2xl transition-transform duration-500 ease-in-out ${
        isVisible ? 'translate-x-0' : '-translate-x-full'
      }`} style={{ 
        width: '100vw',
        background: 'rgba(220, 38, 38, 0.3)', // red-700 with 30% opacity to match SelectionBar pattern
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRight: 'none',
        borderTop: '1px solid rgba(255,255,255,0.2)',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
        zIndex: 20
      }}>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="fixed inset-0 flex items-center justify-center z-40 backdrop-filter backdrop-blur-md bg-red-700 bg-opacity-30">
            <div className="flex flex-col items-center space-y-4 p-8 rounded-2xl backdrop-filter backdrop-blur-md bg-red-700 bg-opacity-30 shadow-lg" style={{
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)'
            }}>
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600"></div>
              <p className="text-white font-medium text-lg" style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' }}>Loading TUC Store...</p>
            </div>
          </div>
        )}

        {/* Shopify Buy Button Container with animated scroll */}
        <div 
          className="store-scroll-container h-full overflow-y-auto" 
          style={{ 
            height: '100vh',
            paddingTop: '90px',
            scrollBehavior: 'auto'
          }}
        >
          <div 
            id="collection-component-1751939732833" 
            style={{
              backgroundImage: `
                linear-gradient(rgba(220, 38, 38, 0.2) 1px, transparent 1px),
                linear-gradient(90deg, rgba(220, 38, 38, 0.2) 1px, transparent 1px)
              `,
              backgroundSize: '300px 300px, 300px 300px',
              minHeight: '100vh',
              paddingLeft: '24px',
              paddingRight: '24px',
              paddingBottom: '24px'
            }}
          />
        </div>
      </div>
    </div>
  );
} 