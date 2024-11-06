module.exports = {
    parser: 'postcss-scss',
    plugins: [
        require('postcss-import'), // For importing files in your CSS/SCSS
        require('postcss-nested'),  // Add this line
        require('tailwindcss'),    // TailwindCSS utilities
        require('autoprefixer'),   // Automatically adds vendor prefixes
    ],
};