'use strict';

exports.handler = (event, context, callback) => {
    const request = event.Records[0].cf.request;
    const headers = request.headers;

    // 年齢認証をすでに通過したかどうかのチェック
    const ageVerificationPassed = (headers.cookie && headers.cookie.some(cookie => cookie.value.match(/^age-verified=true$/)));

    if (!ageVerificationPassed) {
        // 年齢認証を通過していなければ認証ページにリダイレクト
        const response = {
            status: '302',
            statusDescription: 'Found',
            headers: {
                location: [{
                    key: 'Location',
                    value: '/age-verification.html', // 年齢認証ページのパス
                }],
                // 必要に応じてセキュリティ関連のヘッダーを追加
                'strict-transport-security': [{
                    key: 'Strict-Transport-Security',
                    value: 'max-age=63072000; includeSubdomains; preload'
                }],
                'x-content-type-options': [{
                    key: 'X-Content-Type-Options',
                    value: 'nosniff'
                }],
                'x-frame-options': [{
                    key: 'X-Frame-Options',
                    value: 'DENY'
                }],
                'x-xss-protection': [{
                    key: 'X-XSS-Protection',
                    value: '1; mode=block'
                }],
                // その他のカスタムヘッダーがあればここに追加する
            },
        };
        // リダイレクトレスポンスを返す
        callback(null, response);
    } else {
        // 年齢認証を通過していれば元のリクエストを続行
        callback(null, request);
    }
};
