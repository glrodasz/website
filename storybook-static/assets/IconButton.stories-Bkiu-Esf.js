import{j as e}from"./jsx-runtime-u17CrQMm.js";import"./iframe-D7STJyU2.js";import{B as b}from"./Button-BwBuFQtb.js";import"./Icon-BTX29yW_.js";import"./NumberButton-8_4i4V2c.js";import"./CheckButton-BULpUXbt.js";import"./Typography-CYxU4y7s.js";import"./Logo-BnSdjmSp.js";import"./Status-BclkR0qI.js";import"./Tag-Ba0XjyvK.js";import"./preload-helper-PPVm8Dsz.js";import"./Check.esm-CzB6_zDH.js";import"./IconBase.esm-A2qEZsqF.js";const o=({icon:u,label:h,iconPosition:x="left",...y})=>{const v=e.jsxs("div",{className:`qd-icon-button__content qd-icon-button__content--${x}`,children:[e.jsx("span",{className:"qd-icon-button__icon",children:u}),e.jsx("span",{className:"qd-icon-button__label",children:h})]});return e.jsx(b,{...y,className:"qd-icon-button",children:v})};o.__docgenInfo={description:`IconButton molecule - combines Button atom with an icon
Based on Quantum Design system`,methods:[],displayName:"IconButton",props:{icon:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:"Icon component or element to display"},label:{required:!0,tsType:{name:"string"},description:"Button text label"},iconPosition:{required:!1,tsType:{name:"union",raw:"'left' | 'right'",elements:[{name:"literal",value:"'left'"},{name:"literal",value:"'right'"}]},description:"Icon position relative to text",defaultValue:{value:"'left'",computed:!1}}},composes:["Omit"]};const n=()=>e.jsx("svg",{width:"20",height:"20",viewBox:"0 0 20 20",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:e.jsx("path",{d:"M16.6667 5L7.50004 14.1667L3.33337 10",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})}),a=()=>e.jsx("svg",{width:"20",height:"20",viewBox:"0 0 20 20",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:e.jsx("path",{d:"M4.16667 10H15.8333M15.8333 10L10 4.16667M15.8333 10L10 15.8333",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})}),g=()=>e.jsx("svg",{width:"20",height:"20",viewBox:"0 0 20 20",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:e.jsx("path",{d:"M10 4.16667V15.8333M4.16667 10H15.8333",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})}),_={title:"Molecules/IconButton",component:o,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{variant:{control:"select",options:["primary","secondary","ghost-light","ghost-dark"],description:"Button visual variant"},size:{control:"radio",options:["small","large"],description:"Button size"},iconPosition:{control:"radio",options:["left","right"],description:"Icon position relative to text"},disabled:{control:"boolean",description:"Disabled state"},onClick:{action:"clicked"}}},r={args:{variant:"primary",size:"large",icon:e.jsx(n,{}),label:"Confirm",iconPosition:"left"}},i={args:{variant:"primary",size:"large",icon:e.jsx(a,{}),label:"Continue",iconPosition:"right"}},t={args:{variant:"secondary",size:"large",icon:e.jsx(g,{}),label:"Add Item",iconPosition:"left"}},s={args:{variant:"secondary",size:"small",icon:e.jsx(n,{}),label:"Done",iconPosition:"left"}},l={args:{variant:"ghost-light",size:"large",icon:e.jsx(a,{}),label:"Go Back",iconPosition:"left"}},c={args:{variant:"ghost-dark",size:"large",icon:e.jsx(a,{}),label:"Next Step",iconPosition:"right"},parameters:{backgrounds:{default:"dark"}}},d={args:{variant:"primary",size:"large",icon:e.jsx(n,{}),label:"Disabled",disabled:!0}},p={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"16px"},children:[e.jsx(o,{variant:"primary",size:"large",icon:e.jsx(n,{}),label:"Icon Left",iconPosition:"left"}),e.jsx(o,{variant:"primary",size:"large",icon:e.jsx(a,{}),label:"Icon Right",iconPosition:"right"})]})},m={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"16px"},children:[e.jsxs("div",{style:{display:"flex",gap:"16px",alignItems:"center"},children:[e.jsx(o,{variant:"primary",size:"large",icon:e.jsx(n,{}),label:"Primary"}),e.jsx(o,{variant:"secondary",size:"large",icon:e.jsx(g,{}),label:"Secondary"}),e.jsx(o,{variant:"ghost-light",size:"large",icon:e.jsx(a,{}),label:"Ghost Light"})]}),e.jsxs("div",{style:{display:"flex",gap:"16px",alignItems:"center"},children:[e.jsx(o,{variant:"primary",size:"small",icon:e.jsx(n,{}),label:"Small"}),e.jsx(o,{variant:"secondary",size:"small",icon:e.jsx(g,{}),label:"Small"}),e.jsx(o,{variant:"ghost-light",size:"small",icon:e.jsx(a,{}),label:"Small"})]}),e.jsxs("div",{style:{display:"flex",gap:"16px",alignItems:"center"},children:[e.jsx(o,{variant:"primary",disabled:!0,icon:e.jsx(n,{}),label:"Disabled"}),e.jsx(o,{variant:"secondary",disabled:!0,icon:e.jsx(g,{}),label:"Disabled"})]})]})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    size: 'large',
    icon: <CheckIcon />,
    label: 'Confirm',
    iconPosition: 'left'
  }
}`,...r.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    size: 'large',
    icon: <ArrowIcon />,
    label: 'Continue',
    iconPosition: 'right'
  }
}`,...i.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'secondary',
    size: 'large',
    icon: <PlusIcon />,
    label: 'Add Item',
    iconPosition: 'left'
  }
}`,...t.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'secondary',
    size: 'small',
    icon: <CheckIcon />,
    label: 'Done',
    iconPosition: 'left'
  }
}`,...s.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'ghost-light',
    size: 'large',
    icon: <ArrowIcon />,
    label: 'Go Back',
    iconPosition: 'left'
  }
}`,...l.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'ghost-dark',
    size: 'large',
    icon: <ArrowIcon />,
    label: 'Next Step',
    iconPosition: 'right'
  },
  parameters: {
    backgrounds: {
      default: 'dark'
    }
  }
}`,...c.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    size: 'large',
    icon: <CheckIcon />,
    label: 'Disabled',
    disabled: true
  }
}`,...d.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  }}>
      <IconButton variant="primary" size="large" icon={<CheckIcon />} label="Icon Left" iconPosition="left" />
      <IconButton variant="primary" size="large" icon={<ArrowIcon />} label="Icon Right" iconPosition="right" />
    </div>
}`,...p.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  }}>
      <div style={{
      display: 'flex',
      gap: '16px',
      alignItems: 'center'
    }}>
        <IconButton variant="primary" size="large" icon={<CheckIcon />} label="Primary" />
        <IconButton variant="secondary" size="large" icon={<PlusIcon />} label="Secondary" />
        <IconButton variant="ghost-light" size="large" icon={<ArrowIcon />} label="Ghost Light" />
      </div>
      <div style={{
      display: 'flex',
      gap: '16px',
      alignItems: 'center'
    }}>
        <IconButton variant="primary" size="small" icon={<CheckIcon />} label="Small" />
        <IconButton variant="secondary" size="small" icon={<PlusIcon />} label="Small" />
        <IconButton variant="ghost-light" size="small" icon={<ArrowIcon />} label="Small" />
      </div>
      <div style={{
      display: 'flex',
      gap: '16px',
      alignItems: 'center'
    }}>
        <IconButton variant="primary" disabled icon={<CheckIcon />} label="Disabled" />
        <IconButton variant="secondary" disabled icon={<PlusIcon />} label="Disabled" />
      </div>
    </div>
}`,...m.parameters?.docs?.source}}};const N=["PrimaryWithCheck","PrimaryWithArrow","SecondaryWithPlus","SecondarySmall","GhostLight","GhostDark","Disabled","IconPositions","AllVariants"];export{m as AllVariants,d as Disabled,c as GhostDark,l as GhostLight,p as IconPositions,i as PrimaryWithArrow,r as PrimaryWithCheck,s as SecondarySmall,t as SecondaryWithPlus,N as __namedExportsOrder,_ as default};
