#!/usr/bin/env node

/**
 * SPA Routing Verification Script
 * Tests if your deployed site properly handles deep routes
 * 
 * Usage:
 *   node verify-spa-routing.js https://k-mondal-store-frontend.onrender.com
 */

import https from 'https';
import http from 'http';

const ROUTES_TO_TEST = [
    '/',
    '/product/695dd50d69ad20d362606f79',
    '/cart',
    '/login',
    '/admin',
    '/my-orders',
    '/support'
];

function checkRoute(baseUrl, route) {
    return new Promise((resolve, reject) => {
        const url = new URL(route, baseUrl);
        const protocol = url.protocol === 'https:' ? https : http;

        const request = protocol.get(url.href, {
            headers: {
                'User-Agent': 'SPA-Routing-Checker/1.0'
            }
        }, (res) => {
            let body = '';

            res.on('data', (chunk) => {
                body += chunk;
            });

            res.on('end', () => {
                const isSuccess = res.statusCode === 200;
                const isHTML = res.headers['content-type']?.includes('text/html');
                const hasReactRoot = body.includes('id="root"') || body.includes('id=root');

                resolve({
                    route,
                    status: res.statusCode,
                    isSuccess,
                    isHTML,
                    hasReactRoot,
                    passed: isSuccess && isHTML && hasReactRoot
                });
            });
        });

        request.on('error', (err) => {
            reject(err);
        });

        request.setTimeout(10000, () => {
            request.destroy();
            reject(new Error('Request timeout'));
        });
    });
}

async function verifyDeployment(baseUrl) {
    console.log('\n🔍 SPA Routing Verification');
    console.log('━'.repeat(60));
    console.log(`Testing: ${baseUrl}\n`);

    const results = [];

    for (const route of ROUTES_TO_TEST) {
        try {
            process.stdout.write(`Testing ${route}... `);
            const result = await checkRoute(baseUrl, route);
            results.push(result);

            if (result.passed) {
                console.log('✅ PASS');
            } else {
                console.log('❌ FAIL');
                if (!result.isSuccess) console.log(`   └─ HTTP ${result.status}`);
                if (!result.isHTML) console.log(`   └─ Not HTML response`);
                if (!result.hasReactRoot) console.log(`   └─ Missing React root element`);
            }
        } catch (error) {
            console.log('❌ ERROR');
            console.log(`   └─ ${error.message}`);
            results.push({ route, passed: false, error: error.message });
        }
    }

    console.log('\n' + '━'.repeat(60));
    const passedCount = results.filter(r => r.passed).length;
    const totalCount = results.length;

    if (passedCount === totalCount) {
        console.log(`✅ All tests passed! (${passedCount}/${totalCount})`);
        console.log('\nYour SPA routing is working correctly! 🎉');
    } else {
        console.log(`❌ ${totalCount - passedCount} test(s) failed (${passedCount}/${totalCount} passed)`);
        console.log('\n⚠️  SPA routing is NOT working correctly.');
        console.log('\nPossible issues:');
        console.log('  1. render.yaml is not in repository root');
        console.log('  2. Rewrite rules are not configured');
        console.log('  3. Site is not deployed as a Static Site');
        console.log('\nSee SPA_ROUTING_FIX.md for solutions.');
    }

    console.log('━'.repeat(60) + '\n');
}

// Get URL from command line arguments
const args = process.argv.slice(2);
const targetUrl = args[0];

if (!targetUrl) {
    console.error('\n❌ Error: Please provide a URL to test');
    console.error('\nUsage:');
    console.error('  node verify-spa-routing.js <URL>');
    console.error('\nExample:');
    console.error('  node verify-spa-routing.js https://k-mondal-store-frontend.onrender.com');
    process.exit(1);
}

// Validate URL
try {
    new URL(targetUrl);
} catch (error) {
    console.error(`\n❌ Error: Invalid URL "${targetUrl}"`);
    console.error('Please provide a valid URL including protocol (http:// or https://)');
    process.exit(1);
}

// Run verification
verifyDeployment(targetUrl).catch((error) => {
    console.error('\n❌ Verification failed:', error.message);
    process.exit(1);
});
