/**
 * TypeScript Utilities for ParryApplications Portfolio
 * Type definitions and helper functions
 */

// ===== Type Definitions =====

interface ContactFormData {
    Name: string;
    Email: string;
    Phone: string;
    Message?: string;
}

interface AppDevFormData extends ContactFormData {
    AppDatabaseRequest?: string;
    UI_Info: string;
    Apptype: string;
    ApptypeOther?: string;
    Features?: string;
}

interface TutorFormData extends ContactFormData {
    Qualification?: string;
    Subject?: string;
    Experience?: string;
}

interface FirebaseConfig {
    apiKey: string;
    authDomain: string;
    databaseURL: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId: string;
}

interface FormValidationResult {
    isValid: boolean;
    errors: string[];
}

// ===== Validation Utilities =====

class FormValidator {
    /**
     * Validate email format
     */
    static validateEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Validate phone number (10 digits)
     */
    static validatePhone(phone: string): boolean {
        const phoneRegex = /^[0-9]{10}$/;
        return phoneRegex.test(phone);
    }

    /**
     * Validate required field
     */
    static validateRequired(value: string): boolean {
        return value.trim().length > 0;
    }

    /**
     * Validate contact form
     */
    static validateContactForm(data: ContactFormData): FormValidationResult {
        const errors: string[] = [];

        if (!this.validateRequired(data.Name)) {
            errors.push('Name is required');
        }

        if (!this.validateEmail(data.Email)) {
            errors.push('Valid email is required');
        }

        if (!this.validatePhone(data.Phone)) {
            errors.push('Valid 10-digit phone number is required');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Validate app development form
     */
    static validateAppDevForm(data: AppDevFormData): FormValidationResult {
        const baseValidation = this.validateContactForm(data);
        const errors = [...baseValidation.errors];

        if (!this.validateRequired(data.UI_Info)) {
            errors.push('UI design preference is required');
        }

        if (!this.validateRequired(data.Apptype)) {
            errors.push('Application type is required');
        }

        if (data.Apptype === 'other' && !this.validateRequired(data.ApptypeOther || '')) {
            errors.push('Please specify the application type');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

// ===== String Utilities =====

class StringUtils {
    /**
     * Capitalize first letter of each word
     */
    static titleCase(str: string): string {
        return str.replace(/\w\S*/g, (txt) => {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    /**
     * Truncate string to specified length
     */
    static truncate(str: string, maxLength: number): string {
        if (str.length <= maxLength) return str;
        return str.substring(0, maxLength - 3) + '...';
    }

    /**
     * Remove extra whitespace
     */
    static normalizeWhitespace(str: string): string {
        return str.trim().replace(/\s+/g, ' ');
    }

    /**
     * Sanitize input for display
     */
    static sanitize(str: string): string {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
}

// ===== Date Utilities =====

class DateUtils {
    /**
     * Format date as DD/MM/YYYY
     */
    static formatDate(date: Date = new Date()): string {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    /**
     * Get relative time string
     */
    static getRelativeTime(date: Date): string {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        return this.formatDate(date);
    }
}

// ===== DOM Utilities =====

class DOMUtils {
    /**
     * Safely get element by ID
     */
    static getElementById<T extends HTMLElement>(id: string): T | null {
        return document.getElementById(id) as T | null;
    }

    /**
     * Safely query selector
     */
    static querySelector<T extends HTMLElement>(selector: string): T | null {
        return document.querySelector(selector) as T | null;
    }

    /**
     * Safely query selector all
     */
    static querySelectorAll<T extends HTMLElement>(selector: string): NodeListOf<T> {
        return document.querySelectorAll(selector) as NodeListOf<T>;
    }

    /**
     * Add event listener with type safety
     */
    static addEventListener<K extends keyof HTMLElementEventMap>(
        element: HTMLElement,
        type: K,
        listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
        options?: boolean | AddEventListenerOptions
    ): void {
        element.addEventListener(type, listener, options);
    }

    /**
     * Show element
     */
    static show(element: HTMLElement): void {
        element.style.display = 'block';
    }

    /**
     * Hide element
     */
    static hide(element: HTMLElement): void {
        element.style.display = 'none';
    }

    /**
     * Toggle element visibility
     */
    static toggle(element: HTMLElement): void {
        element.style.display = element.style.display === 'none' ? 'block' : 'none';
    }
}

// ===== Local Storage Utilities =====

class StorageUtils {
    /**
     * Save to local storage
     */
    static save<T>(key: string, value: T): void {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }

    /**
     * Load from local storage
     */
    static load<T>(key: string): T | null {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return null;
        }
    }

    /**
     * Remove from local storage
     */
    static remove(key: string): void {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing from localStorage:', error);
        }
    }

    /**
     * Clear all local storage
     */
    static clear(): void {
        try {
            localStorage.clear();
        } catch (error) {
            console.error('Error clearing localStorage:', error);
        }
    }
}

// ===== Analytics Utilities =====

class AnalyticsUtils {
    /**
     * Track page view
     */
    static trackPageView(pageName: string): void {
        if (typeof firebase !== 'undefined' && firebase.analytics) {
            firebase.analytics().logEvent('page_view', {
                page_name: pageName,
                page_location: window.location.href,
                page_path: window.location.pathname
            });
        }
    }

    /**
     * Track custom event
     */
    static trackEvent(eventName: string, params?: Record<string, any>): void {
        if (typeof firebase !== 'undefined' && firebase.analytics) {
            firebase.analytics().logEvent(eventName, params);
        }
    }

    /**
     * Track form submission
     */
    static trackFormSubmission(formType: string): void {
        this.trackEvent('form_submission', {
            form_type: formType,
            timestamp: new Date().toISOString()
        });
    }
}

// ===== Export for use in other modules =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        FormValidator,
        StringUtils,
        DateUtils,
        DOMUtils,
        StorageUtils,
        AnalyticsUtils
    };
}

// Make available globally
declare global {
    interface Window {
        FormValidator: typeof FormValidator;
        StringUtils: typeof StringUtils;
        DateUtils: typeof DateUtils;
        DOMUtils: typeof DOMUtils;
        StorageUtils: typeof StorageUtils;
        AnalyticsUtils: typeof AnalyticsUtils;
    }
}

window.FormValidator = FormValidator;
window.StringUtils = StringUtils;
window.DateUtils = DateUtils;
window.DOMUtils = DOMUtils;
window.StorageUtils = StorageUtils;
window.AnalyticsUtils = AnalyticsUtils;
