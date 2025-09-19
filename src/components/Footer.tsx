import React from 'react';
import { NestValueIcon } from './nest-value-icon';
import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import './index.css';

interface FooterProps {
  onPageChange: (page: string) => void;
}

export function Footer({ onPageChange }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const handlePageChangeWithScroll = (page: string) => {
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-card border-t border-border">
      <div sty className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="Flex_wrapper">
          {/* Company Info */}
          <div className="flex_box">
            <div className="flex items-center space-x-2 p14px">
              <NestValueIcon className="h-8 w-8 " />
              <span className="text-xl text-foreground font-medium">NestValue</span>
            </div>
            
            <p className="text-sm text-muted-foreground leading-relaxed p14px">
              Your trusted partner for investment planning and financial forecasting. Make informed decisions 
              with our comprehensive investment calculator.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm text-muted-foreground p14px">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>support@nestvalue.us</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-muted-foreground p14px">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-muted-foreground p14px">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>New York, NY, USA</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex_box">
            <h3 className="text-base font-medium text-foreground p14px pb__10">Quick Links</h3>
            <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => handlePageChangeWithScroll('home')}
                    className=" p14px text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handlePageChangeWithScroll('input')}
                    className=" p14px text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Investment Calculator
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handlePageChangeWithScroll('about')}
                    className=" p14px text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handlePageChangeWithScroll('contact')}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors p14px"
                  >
                    Contact
                  </button>
                </li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div className="flex_box">
            <h3 className="text-base font-medium text-foreground p14px pb__10">Legal & Support</h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => handlePageChangeWithScroll('privacy')}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors p14px"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePageChangeWithScroll('terms')}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors p14px"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePageChangeWithScroll('contact')}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors p14px"
                >
                  Help & Support
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePageChangeWithScroll('about')}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="flex_box">
            <h3 className="text-base font-medium text-foreground p14px pb__10">Resources</h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="https://www.investor.gov" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className=" p14px text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-2"
                >
                  <span>SEC Investor Education</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.bogleheads.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className=" p14px text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-2"
                >
                  <span>Bogleheads Community</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.morningstar.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className=" p14px text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-2"
                >
                  <span>Morningstar Research</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.investor.gov" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-2"
                >
                  <span>Investor.gov</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-4 pt-8 border-t border-border">
          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground mb-1">
              © {currentYear} NestValue.us. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-4xl mx-auto">
              <strong>Investment advice is for educational purposes only.</strong> Past performance does not guarantee future results. 
              Always consult with a qualified financial advisor.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
