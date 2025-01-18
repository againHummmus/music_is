import type { Config } from 'tailwindcss';

const config: Config = {
    mode: 'jit',
    future: {
        hoverOnlyWhenSupported: true,
    },
    content: [
        './components/**/*.{js,ts,jsx,tsx,html,css,scss}',
        './src/**/*.{js,ts,jsx,tsx,html,css,scss}',
    ],
    theme: {
        container: {
            screens: {
                max: '1280px',
            },
            center: true,
        },
        extend: {
            screens: {
                '350px': '350px',
                '400px': '400px',
                '500px': '500px',
                tablet: '680px',
                main: '800px',
                '900px': '900px',
                '980px': '980px',
                laptop: '1024px',
                '1124px': '1124px',
                '1140px': '1140px',
                desktop: '1280px',
            },
            maxWidth: {
                'main-width': '67.5rem',
                '1/2': '50%',
                '1/3': '33.33%',
                '1/4': '25%',
                '3/4': '75%',
            },
            minWidth: {
                320: '320px',
            },
            colors: {
                //main
                mainWhite: '#F9F9F9',
                mainDark: '#2F313A',
                secondaryOrange: '#FF7A1B',
                darkStormy: '#8D90A3',
                lightStormy: '#D0D4E5',
                placeholderOrange: '#FF7948/60',
                mainBlack: '#282727',
                mainOrange: '#FF8C3A',

                //funny
                funnyYellow: '#FFC63B',
                funnyBlue: '#3BB0FF',
                funnyGrey: '#5D7280',
                funnyBrown: '#80765D'
            },
            fontSize: {
                h1: ['2rem', '2.4rem'],
                h2: ['1.5rem', '1.8rem'],
                h3: ['1.25rem', '1.5rem'],
                h4: ['1rem', '1.2rem'],
                '10xl': '0.625rem', // 10px
                xs: '0.75rem', // 12px
                '13xl': '0.8125rem', // 13px
                sm: '0.875rem', // 14px
                '15xl': '0.9375rem', // 15px
                base: '1rem', // 16px
                lg: '1.125rem', // 18px
                xl: '1.25rem', // 20px
                '2xl': '1.5rem', // 24px
                '3xl': '1.875rem', // 30px
                '32xl': '2rem', // 32px
                '4xl': '2.25rem', // 36px
                '64xl': '4rem', // 64px
            },
            lineHeight: {
                1.2: '1.2',
            },
            fontFamily: {
                golos: ['var(--font-golos)']
            },
            spacing: {
                5: '0.3125rem',
                10: '0.625rem',
                15: '0.9375rem',
                20: '1.25rem',
                25: '1.5625rem',
                30: '1.875rem',
                35: '2.1875rem',
                40: '2.5rem',
                50: '3.125rem',
                60: '3.75rem',
                70: '4.375rem',
                80: '5rem',
                90: '5.625rem',
                100: '6.25rem',
            },
            borderRadius: {
                md: '0.3125rem',
                '10px': '0.625rem',
                '15px': '0.9375rem',
                '20px': '1.25rem',
            },
            backgroundImage: {
                mainBgMobile:
                    'url("/images/backgrounds/noise.png"),url("/images/backgrounds/orangeBgMobile.webp")',
                mainBgDesktop:
                    'url("/images/backgrounds/noise.png"),url("/images/backgrounds/orangeBgDesktop.png")',
                noise: 'url("/images/backgrounds/noise.png")',
                exclusiveBonusBg: 'url("/images/backgrounds/exclusiveBonusBg.png")',
                imageBg: 'url("/images/backgrounds/imageBg.png")',
            },
            boxShadow: {
                card: '0 0 10px rgba(0, 0, 0, 0.1), 0 4px 10px rgba(0, 0, 0, 0.1)',
                headerMenuCard: '0px 5px 6px 0px rgba(0, 0, 0, 0.25);',
                ball: '12.4px 12.4px 12.4px rgba(0, 0, 0, 0.25)',
                postsAndGuides: '',
            },
            zIndex: {
                '-1': '-1',
                1: '1',
            },
            keyframes: {
                rightPhone: {
                    '0%, 100%': { transform: 'translateY(55%)' },
                    '50%': { transform: 'translateY(35%)' },
                },
                leftPhone: {
                    '0%, 100%': { transform: 'translateY(45%) translateX(-25%)' },
                    '50%': { transform: 'translateY(65%) translateX(-25%)' },
                },
                smallBanner: {
                    '0%, 100%': { transform: 'translateY(-32%) translateX(25%) rotate(-13deg)' },
                    '50%': { transform: 'translateY(-32%) translateX(100%) rotate(0deg)' },
                },
                bigBanner: {
                    '0%, 100%': { transform: 'translateY(53%) translateX(179%) rotate(17deg)' },
                    '50%': { transform: 'translateY(55%) translateX(260%) rotate(0deg)' },
                },
                wiggleToRight: {
                    '0%, 100%': { transform: 'rotate(0deg)' },
                    '50%': { transform: 'rotate(-10deg)' },
                },
                wiggleToLeft: {
                    '0%, 100%': { transform: 'rotate(0deg)' },
                    '50%': { transform: 'rotate(10deg)' },
                },
                giftOnRedirect: {
                    '0%, 100%': {
                        transform: 'translateX(15%) rotate(0deg) scale(0.55)',
                    },
                    '50%': {
                        transform: 'translateX(15%) rotate(-40deg) scale(0.8)',
                    },
                },
                ball: {
                    '0%, 100%': {
                        transform: 'translateY(-25%) translateX(-50%) rotate(0deg) scale(0.3)',
                    },
                    '50%': {
                        transform: 'translateY(-50%) translateX(-50%) rotate(70deg) scale(0.4)',
                    },
                },
                rightS: {
                    '0%, 100%': {
                        transform: 'translateX(40%)',
                    },
                    '50%': {
                        transform: 'translateX(50%)',
                    },
                },
                leftS: {
                    '0%, 100%': {
                        transform: 'translateX(-40%)',
                    },
                    '50%': {
                        transform: 'translateX(-50%)',
                    },
                },
            },
            animation: {
                rightPhone: 'rightPhone 6s ease-in-out infinite',
                leftPhone: 'leftPhone 6s ease-in-out infinite',
                smallBanner: 'smallBanner 6s ease-in-out infinite',
                bigBanner: 'bigBanner 6s ease-in-out infinite',
                wiggleToRight: 'wiggleToRight 5s ease-in-out infinite',
                wiggleToLeft: 'wiggleToLeft 5s ease-in-out infinite',
                giftOnRedirect: 'giftOnRedirect 3.5s cubic-bezier(0.10, 0.4, 0.3, 0.7) infinite',
                ball: 'ball 3.5s cubic-bezier(0.10, 0.4, 0.3, 0.7) infinite',
                rightS: 'rightS 3.5s cubic-bezier(0.10, 0.4, 0.3, 0.7) infinite',
                leftS: 'leftS 3.5s cubic-bezier(0.10, 0.4, 0.3, 0.7) infinite',
            },
        },
    },
    plugins: [],
};
export default config;
