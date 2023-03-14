import * as nodePath from 'path';
const rootFolder = nodePath.basename(nodePath.resolve());


const buildFolder = './dist';
const srcFolder = './src';

export const path = {
    build: {
        js: buildFolder+'/js/',
        css: buildFolder+'/css/',
        html: './',
        images: buildFolder+'/assets/images/',
        fonts: buildFolder+'/assets/fonts/',
        files: buildFolder+'/assets/files/',
    },
    src: {
        js: srcFolder+'/main.js',
        images: srcFolder+'/assets/images/**/*.{jpg,jpeg,png,gif,webp}',
        svg: srcFolder+'/assets/images/**/*.svg',
        scss: srcFolder+'/scss/style.scss',
        html: srcFolder+'/*.html',
        files: srcFolder+'/assets/files/**/*.*',
        svgicons: srcFolder+'/assets/svgicons/*.svg',
    },
    watch: {
        js: srcFolder+'/**/*.js',
        scss: srcFolder+'/scss/**/*.scss',
        html: srcFolder+'/**/*.html',
        images: srcFolder+'/assets/images/**/*.{jpg,jpeg,png,gif,webp,svg,ico}',
        files: srcFolder+'/assets/files/**/*.*',
    },
    clean: buildFolder,
    buildFolder: buildFolder,
    srcFolder: srcFolder,
    rootFolder: rootFolder,
    ftp: ''
}