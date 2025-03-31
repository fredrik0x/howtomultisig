import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				multisig: {
					bg: {
						DEFAULT: '#ECEFF4',
						dark: '#1A202C'
					},
					card: {
						DEFAULT: '#E5E9F0',
						dark: '#2D3748'
					},
					purple: {
						DEFAULT: '#5E81AC', 
						dark: '#63B3ED'
					},
					'purple-light': {
						DEFAULT: '#81A1C1',
						dark: '#90CDF4'
					},
					'purple-dark': {
						DEFAULT: '#4C566A',
						dark: '#4A5568'
					},
					red: '#BF616A',
					text: {
						DEFAULT: '#2E3440',
						dark: '#F7FAFC'
					},
					'text-muted': {
						DEFAULT: '#434C5E',
						dark: '#E2E8F0'
					},
					critical: '#F56565',
					recommended: '#ECC94B',
					essential: '#68D391'
				},
				nord: {
					'0': '#2E3440',  // Polar Night (darkest)
					'1': '#3B4252',  // Polar Night
					'2': '#434C5E',  // Polar Night
					'3': '#4C566A',  // Polar Night
					'4': '#D8DEE9',  // Snow Storm (lightest)
					'5': '#E5E9F0',  // Snow Storm
					'6': '#ECEFF4',  // Snow Storm
					'7': '#8FBCBB',  // Frost
					'8': '#88C0D0',  // Frost
					'9': '#81A1C1',  // Frost
					'10': '#5E81AC', // Frost
					'11': '#BF616A', // Aurora (red)
					'12': '#D08770', // Aurora (orange)
					'13': '#EBCB8B', // Aurora (yellow)
					'14': '#A3BE8C', // Aurora (green)
					'15': '#B48EAD'  // Aurora (purple)
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				'fade-up': {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'pulse-soft': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.85' }
				},
				'scale-in': {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out',
				'fade-up': 'fade-up 0.6s ease-out',
				'pulse-soft': 'pulse-soft 3s infinite ease-in-out',
				'scale-in': 'scale-in 0.3s ease-out',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
