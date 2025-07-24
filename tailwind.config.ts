import type { Config } from 'tailwindcss';

const config: Config = {
	darkMode: 'class',
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}'
	],
	theme: {
		extend: {
			colors: {
				// Official Kaspa brand colors from https://kaspa.org/media-kit/
				kaspa: {
					primary: '#70C7BA', // Primary teal
					secondary: '#49EACB', // Secondary bright teal
					dark: '#231F20', // Primary dark
					gray: '#B6B6B6' // Primary gray
				},
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: '#70C7BA', // Use Kaspa primary color
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: '#49EACB', // Use Kaspa secondary color
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: '#70C7BA', // Use Kaspa primary for focus rings
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			fontFamily: {
				// Official Kaspa typography with proper CSS variables
				'kaspa-header': ['var(--font-kaspa-header)', 'Rubik', 'sans-serif'], // Header font
				'kaspa-subheader': ['var(--font-kaspa-subheader)', 'Oswald', 'sans-serif'], // Sub-header font
				'kaspa-body': ['var(--font-kaspa-body)', 'Lato', 'sans-serif'], // Body font
				// Keep existing defaults
				sans: ['var(--font-kaspa-body)', 'Lato', 'sans-serif'],
				mono: ['monospace']
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			animation: {
				'bounce-gentle': 'bounce-gentle 4s ease-in-out infinite',
			},
			keyframes: {
				'bounce-gentle': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				}
			}
		}
	},
	plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')]
};

export default config; 