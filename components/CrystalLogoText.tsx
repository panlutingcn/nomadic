'use client'
import React from 'react'

export default function CrystalLogoText({
  height = 50,
  style,
}: {
  height?: number
  style?: React.CSSProperties
}) {
  return (
    <svg
      height={height}
      viewBox="0 0 594 158"
      style={{ display: 'block', width: 'auto', overflow: 'visible', ...style }}
    >
      <defs>
        <filter
          id="nomadic-crystal"
          x="-18%" y="-55%" width="136%" height="230%"
          colorInterpolationFilters="sRGB"
        >
          {/* 将 logo 所有像素变为白色，保留 alpha（字母形状） */}
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0"
            result="whiteLetters"
          />

          {/* 模糊 alpha 通道 → 形成凹凸贴图（让每个字母边缘成为 3D 表面） */}
          <feGaussianBlur in="SourceAlpha" stdDeviation="3.5" result="bump" />

          {/* 漫反射光照 — 磨砂白基础色：lightingColor 接近纯白，背光面也只是浅灰 */}
          <feDiffuseLighting
            in="bump"
            surfaceScale="8"
            diffuseConstant="1.2"
            lightingColor="#f4faf7"
            result="diffuse"
          >
            <feDistantLight azimuth="225" elevation="46" />
          </feDiffuseLighting>

          {/* 镜面光照 — specularExponent 调低 = 高光更散 = 磨砂质感 */}
          <feSpecularLighting
            in="bump"
            surfaceScale="8"
            specularConstant="3.5"
            specularExponent="45"
            lightingColor="white"
            result="specular"
          >
            <feDistantLight azimuth="225" elevation="68" />
          </feSpecularLighting>

          {/* 将光照结果裁剪到字母轮廓内 */}
          <feComposite in="diffuse" in2="SourceAlpha" operator="in" result="diffuseMasked" />
          <feComposite in="specular" in2="SourceAlpha" operator="in" result="specularMasked" />

          {/* 白色字母 × 漫反射 = 水晶基础色（迎光面亮/背光面偏青） */}
          <feBlend in="whiteLetters" in2="diffuseMasked" mode="multiply" result="diffuseLit" />

          {/* 叠加镜面高光（screen 模式：只加亮不压暗） */}
          <feBlend in="diffuseLit" in2="specularMasked" mode="screen" result="crystalLit" />

          {/* 深阴影：字母底部向下投影，营造悬浮立体感 */}
          <feOffset in="SourceAlpha" dx="0" dy="8" result="shadowOff" />
          <feGaussianBlur in="shadowOff" stdDeviation="5" result="shadowBlur" />
          <feFlood floodColor="#000906" floodOpacity="0.82" result="shadowFill" />
          <feComposite in="shadowFill" in2="shadowBlur" operator="in" result="deepShadow" />

          {/* 近阴影：给字母增加厚度感 */}
          <feOffset in="SourceAlpha" dx="2.5" dy="4" result="nearOff" />
          <feGaussianBlur in="nearOff" stdDeviation="1.5" result="nearBlur" />
          <feFlood floodColor="#001409" floodOpacity="0.60" result="nearFill" />
          <feComposite in="nearFill" in2="nearBlur" operator="in" result="nearShadow" />

          <feMerge>
            <feMergeNode in="deepShadow" />
            <feMergeNode in="nearShadow" />
            <feMergeNode in="crystalLit" />
          </feMerge>
        </filter>
      </defs>

      <image
        href="/logo-nomadic-t.png"
        x="0"
        y="0"
        width="594"
        height="158"
        preserveAspectRatio="xMidYMid meet"
        filter="url(#nomadic-crystal)"
      />
    </svg>
  )
}
