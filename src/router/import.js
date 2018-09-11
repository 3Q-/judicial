export default (file) => () => import(`@/${file}.vue`);
