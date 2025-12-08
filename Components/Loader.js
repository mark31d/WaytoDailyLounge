// Components/Loader.js
import React from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { WebView } from 'react-native-webview';

const BG = require('../assets/bg.png');

const LOADER_HTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0, maximum-scale=1.0"
  />
  <style>
    * {
      box-sizing: border-box;
    }

    html, body {
      margin: 0;
      padding: 0;
      height: 100%;
      width: 100%;
      background: transparent;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      -webkit-font-smoothing: antialiased;
    }

    /* From Uiverse.io by andrew-demchenk0 */
    .cube-loader {
      position: relative;
      /* u can choose any size */
      width: 120px;
      height: 120px;
      transform-style: preserve-3d;
      transform: rotateX(-30deg);
      animation: animate 4s linear infinite;
    }

    @keyframes animate {
      0% {
        transform: rotateX(-30deg) rotateY(0);
      }
      100% {
        transform: rotateX(-30deg) rotateY(360deg);
      }
    }

    .cube-loader .cube-wrapper {
      position: absolute;
      width: 100%;
      height: 100%;
      transform-style: preserve-3d;
    }

    .cube-loader .cube-wrapper .cube-span {
      position: absolute;
      width: 100%;
      height: 100%;
      transform: rotateY(calc(90deg * var(--i))) translateZ(60px); /* width 120px / 2 = 60px */
      background: linear-gradient(
        to bottom,
        #8B4513 0%,
        #A0522D 5.5%,
        #CD5C5C 12.1%,
        #FF6B35 19.6%,
        #FF7F50 27.9%,
        #FF8A3C 36.6%,
        #FF9F4A 45.6%,
        #FFB23C 54.6%,
        #FFC966 63.4%,
        #FFD700 71.7%,
        #FFE4B5 79.4%,
        #FFF8DC 86.2%,
        #FFFAF0 91.9%,
        #FFFFF0 96.3%,
        #FFFFFF 99%,
        #FFFFFF 100%
      );
    }

    .cube-top {
      position: absolute;
      width: 120px;
      height: 120px;
      background: #8B4513 0%;
      transform: rotateX(90deg) translateZ(60px); /* width 120px / 2 = 60px */
      transform-style: preserve-3d;
    }

    .cube-top::before {
      content: '';
      position: absolute;
      /* u can choose any size */
      width: 120px;
      height: 120px;
      background: #FF8A3C;
      transform: translateZ(-144px);
      filter: blur(15px);
      box-shadow:
        0 0 15px #FF6B35,
        0 0 30px #FF8A3C,
        0 0 45px #FF6B35,
        0 0 60px #FF8A3C;
    }
  </style>
</head>
<body>
  <!-- From Uiverse.io by andrew-demchenk0 -->
  <div class="cube-loader">
    <div class="cube-top"></div>
    <div class="cube-wrapper">
      <span style="--i:0" class="cube-span"></span>
      <span style="--i:1" class="cube-span"></span>
      <span style="--i:2" class="cube-span"></span>
      <span style="--i:3" class="cube-span"></span>
    </div>
  </div>
</body>
</html>
`;

export default function Loader() {
  return (
    <ImageBackground source={BG} style={styles.container} resizeMode="cover">
      <WebView
        originWhitelist={['*']}
        source={{ html: LOADER_HTML }}
        style={styles.webview}
        scrollEnabled={false}
        bounces={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080C1F',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
