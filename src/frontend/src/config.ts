const production = {
    api_url: 'https://snp.firstrf.com/api'
};
const development = {
    api_url: 'http://localhost:8080'
};
export const config = process.env.NODE_ENV === 'development' ? development : production;