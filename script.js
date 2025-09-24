class EmailDiscoveryTool {
    constructor() {
        this.searchBtn = document.getElementById('searchBtn');
        this.domainInput = document.getElementById('domainInput');
        this.loadingIndicator = document.getElementById('loadingIndicator');
        this.resultsSection = document.getElementById('resultsSection');
        this.resultsStats = document.getElementById('resultsStats');
        this.emailList = document.getElementById('emailList');
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.searchBtn.addEventListener('click', () => this.performSearch());
        this.domainInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch();
            }
        });
    }

    async performSearch() {
        const domain = this.domainInput.value.trim();
        if (!domain) {
            alert('Please enter a domain name');
            return;
        }

        this.showLoading(true);
        this.resultsSection.style.display = 'none';

        try {
            // Simulate search delay for realism
            await this.delay(2000);
            
            const emailData = await this.discoverEmails(domain);
            this.displayResults(emailData, domain);
        } catch (error) {
            console.error('Search error:', error);
            alert('An error occurred during the search. Please try again.');
        } finally {
            this.showLoading(false);
        }
    }

    async discoverEmails(domain) {
        // This simulates discovering common company-wide email patterns
        // In a real security research tool, this would involve various discovery techniques
        
        const commonPrefixes = [
            'all', 'allstaff', 'everyone', 'company', 'team', 'staff',
            'employees', 'global', 'announce', 'news', 'updates',
            'notifications', 'alerts', 'broadcast', 'general',
            'info', 'contact', 'support', 'help', 'admin',
            'hr', 'sales', 'marketing', 'engineering', 'dev',
            'security', 'it', 'tech', 'operations', 'finance'
        ];

        const emailAddresses = [];

        for (const prefix of commonPrefixes) {
            const emailAddress = `${prefix}@${domain}`;
            
            // Simulate email validation and size estimation
            const isValid = Math.random() > 0.7; // 30% chance of being valid
            
            if (isValid) {
                const estimatedSize = this.estimateListSize();
                const confidence = this.calculateConfidence(prefix);
                const lastSeen = this.generateLastSeenDate();
                
                emailAddresses.push({
                    address: emailAddress,
                    estimatedSize: estimatedSize,
                    confidence: confidence,
                    lastSeen: lastSeen,
                    type: this.categorizeEmailType(prefix)
                });
            }
        }

        // Sort by confidence and estimated size
        emailAddresses.sort((a, b) => {
            if (b.confidence !== a.confidence) {
                return b.confidence - a.confidence;
            }
            return b.estimatedSize - a.estimatedSize;
        });

        return emailAddresses;
    }

    estimateListSize() {
        // Generate realistic email list sizes
        const sizeRanges = [
            { min: 10, max: 50, weight: 0.3 },      // Small lists
            { min: 51, max: 500, weight: 0.4 },     // Medium lists
            { min: 501, max: 5000, weight: 0.25 },  // Large lists
            { min: 5001, max: 50000, weight: 0.05 } // Very large lists
        ];

        const random = Math.random();
        let cumulativeWeight = 0;

        for (const range of sizeRanges) {
            cumulativeWeight += range.weight;
            if (random <= cumulativeWeight) {
                return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
            }
        }

        return Math.floor(Math.random() * 100) + 10; // Fallback
    }

    calculateConfidence(prefix) {
        const highConfidencePrefixes = ['all', 'allstaff', 'everyone', 'company', 'staff'];
        const mediumConfidencePrefixes = ['team', 'employees', 'announce', 'info', 'contact'];
        
        if (highConfidencePrefixes.includes(prefix)) {
            return Math.floor(Math.random() * 20) + 80; // 80-100%
        } else if (mediumConfidencePrefixes.includes(prefix)) {
            return Math.floor(Math.random() * 30) + 60; // 60-90%
        } else {
            return Math.floor(Math.random() * 40) + 40; // 40-80%
        }
    }

    generateLastSeenDate() {
        const daysAgo = Math.floor(Math.random() * 365);
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);
        return date.toISOString().split('T')[0];
    }

    categorizeEmailType(prefix) {
        const categories = {
            'Administrative': ['all', 'allstaff', 'everyone', 'company', 'staff', 'employees'],
            'Communication': ['announce', 'news', 'updates', 'notifications', 'broadcast'],
            'Support': ['info', 'contact', 'support', 'help'],
            'Department': ['hr', 'sales', 'marketing', 'engineering', 'dev', 'security', 'it', 'tech', 'operations', 'finance'],
            'General': ['team', 'global', 'general', 'alerts', 'admin']
        };

        for (const [category, prefixes] of Object.entries(categories)) {
            if (prefixes.includes(prefix)) {
                return category;
            }
        }
        return 'Other';
    }

    displayResults(emailData, domain) {
        if (emailData.length === 0) {
            this.resultsStats.innerHTML = `
                <div style="text-align: center; color: #7f8c8d;">
                    <h3>No email addresses discovered for ${domain}</h3>
                    <p>Try a different domain or check if the domain exists.</p>
                </div>
            `;
            this.emailList.innerHTML = '';
            this.resultsSection.style.display = 'block';
            return;
        }

        // Display statistics
        const totalEmails = emailData.length;
        const totalEstimatedRecipients = emailData.reduce((sum, email) => sum + email.estimatedSize, 0);
        const avgConfidence = Math.round(emailData.reduce((sum, email) => sum + email.confidence, 0) / totalEmails);

        this.resultsStats.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
                <div>
                    <strong>📧 Email Addresses Found:</strong> ${totalEmails}
                </div>
                <div>
                    <strong>👥 Est. Total Recipients:</strong> ${totalEstimatedRecipients.toLocaleString()}
                </div>
                <div>
                    <strong>🎯 Average Confidence:</strong> ${avgConfidence}%
                </div>
                <div>
                    <strong>🏢 Domain:</strong> ${domain}
                </div>
            </div>
        `;

        // Display email list
        this.emailList.innerHTML = emailData.map(email => this.createEmailItem(email)).join('');
        this.resultsSection.style.display = 'block';
    }

    createEmailItem(email) {
        const sizeClass = this.getSizeClass(email.estimatedSize);
        const sizeLabel = this.getSizeLabel(email.estimatedSize);
        
        return `
            <div class="email-item">
                <div class="email-address">${email.address}</div>
                <div class="email-info">
                    <div class="email-stat">
                        <span class="icon">👥</span>
                        <span>Est. Recipients: <strong>${email.estimatedSize.toLocaleString()}</strong></span>
                        <span class="size-indicator ${sizeClass}">${sizeLabel}</span>
                    </div>
                    <div class="email-stat">
                        <span class="icon">🎯</span>
                        <span>Confidence: <strong>${email.confidence}%</strong></span>
                    </div>
                    <div class="email-stat">
                        <span class="icon">📅</span>
                        <span>Last Seen: <strong>${email.lastSeen}</strong></span>
                    </div>
                    <div class="email-stat">
                        <span class="icon">🏷️</span>
                        <span>Type: <strong>${email.type}</strong></span>
                    </div>
                </div>
            </div>
        `;
    }

    getSizeClass(size) {
        if (size <= 100) return 'size-small';
        if (size <= 1000) return 'size-medium';
        return 'size-large';
    }

    getSizeLabel(size) {
        if (size <= 100) return 'Small';
        if (size <= 1000) return 'Medium';
        return 'Large';
    }

    showLoading(show) {
        this.loadingIndicator.style.display = show ? 'flex' : 'none';
        this.searchBtn.disabled = show;
        this.searchBtn.textContent = show ? 'Searching...' : 'Search Email Lists';
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EmailDiscoveryTool();
    
    // Add some example domains for demonstration
    const examples = ['yahoo.com', 'gmail.com', 'company.com', 'organization.org'];
    const domainInput = document.getElementById('domainInput');
    
    domainInput.addEventListener('focus', function() {
        if (!this.value) {
            this.placeholder = `Try: ${examples[Math.floor(Math.random() * examples.length)]}`;
        }
    });
});

// Add some additional security research utilities
const SecurityUtils = {
    validateDomain: function(domain) {
        const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*$/;
        return domainRegex.test(domain);
    },
    
    sanitizeInput: function(input) {
        return input.replace(/[<>\"'&]/g, '');
    },
    
    generateReport: function(emailData, domain) {
        const report = {
            domain: domain,
            timestamp: new Date().toISOString(),
            totalAddresses: emailData.length,
            totalEstimatedRecipients: emailData.reduce((sum, email) => sum + email.estimatedSize, 0),
            addresses: emailData
        };
        
        return JSON.stringify(report, null, 2);
    }
};