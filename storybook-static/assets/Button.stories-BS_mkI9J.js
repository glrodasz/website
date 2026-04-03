import{j as a}from"./jsx-runtime-u17CrQMm.js";import{B as r}from"./Button-BwBuFQtb.js";import"./iframe-D7STJyU2.js";import"./preload-helper-PPVm8Dsz.js";const v={title:"Atoms/Button",component:r,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{variant:{control:"select",options:["primary","secondary","ghost-light","ghost-dark"],description:"Button visual variant based on Quantum Design system"},size:{control:"radio",options:["small","large"],description:"Button size"},disabled:{control:"boolean",description:"Disabled state"},onClick:{action:"clicked"}}},e={args:{variant:"primary",size:"large",children:"Primary Button"}},s={args:{variant:"primary",size:"small",children:"Primary Button"}},t={args:{variant:"secondary",size:"large",children:"Secondary Button"}},n={args:{variant:"secondary",size:"small",children:"Secondary Button"}},i={args:{variant:"ghost-light",size:"large",children:"Ghost Light Button"}},o={args:{variant:"ghost-light",size:"small",children:"Ghost Light Button"}},l={args:{variant:"ghost-dark",size:"large",children:"Ghost Dark Button"},parameters:{backgrounds:{default:"dark"}}},d={args:{variant:"ghost-dark",size:"small",children:"Ghost Dark Button"},parameters:{backgrounds:{default:"dark"}}},c={args:{variant:"primary",size:"large",disabled:!0,children:"Disabled Button"}},m={args:{variant:"secondary",size:"large",disabled:!0,children:"Disabled Button"}},g={render:()=>a.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"16px",alignItems:"flex-start"},children:[a.jsxs("div",{style:{display:"flex",gap:"16px"},children:[a.jsx(r,{variant:"primary",size:"large",children:"Primary"}),a.jsx(r,{variant:"secondary",size:"large",children:"Secondary"}),a.jsx(r,{variant:"ghost-light",size:"large",children:"Ghost Light"})]}),a.jsxs("div",{style:{display:"flex",gap:"16px"},children:[a.jsx(r,{variant:"primary",size:"small",children:"Primary Small"}),a.jsx(r,{variant:"secondary",size:"small",children:"Secondary Small"}),a.jsx(r,{variant:"ghost-light",size:"small",children:"Ghost Small"})]}),a.jsxs("div",{style:{display:"flex",gap:"16px"},children:[a.jsx(r,{variant:"primary",disabled:!0,children:"Disabled"}),a.jsx(r,{variant:"secondary",disabled:!0,children:"Disabled"}),a.jsx(r,{variant:"ghost-light",disabled:!0,children:"Disabled"})]})]})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    size: 'large',
    children: 'Primary Button'
  }
}`,...e.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    size: 'small',
    children: 'Primary Button'
  }
}`,...s.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'secondary',
    size: 'large',
    children: 'Secondary Button'
  }
}`,...t.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'secondary',
    size: 'small',
    children: 'Secondary Button'
  }
}`,...n.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'ghost-light',
    size: 'large',
    children: 'Ghost Light Button'
  }
}`,...i.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'ghost-light',
    size: 'small',
    children: 'Ghost Light Button'
  }
}`,...o.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'ghost-dark',
    size: 'large',
    children: 'Ghost Dark Button'
  },
  parameters: {
    backgrounds: {
      default: 'dark'
    }
  }
}`,...l.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'ghost-dark',
    size: 'small',
    children: 'Ghost Dark Button'
  },
  parameters: {
    backgrounds: {
      default: 'dark'
    }
  }
}`,...d.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    size: 'large',
    disabled: true,
    children: 'Disabled Button'
  }
}`,...c.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'secondary',
    size: 'large',
    disabled: true,
    children: 'Disabled Button'
  }
}`,...m.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    alignItems: 'flex-start'
  }}>
      <div style={{
      display: 'flex',
      gap: '16px'
    }}>
        <Button variant="primary" size="large">Primary</Button>
        <Button variant="secondary" size="large">Secondary</Button>
        <Button variant="ghost-light" size="large">Ghost Light</Button>
      </div>
      <div style={{
      display: 'flex',
      gap: '16px'
    }}>
        <Button variant="primary" size="small">Primary Small</Button>
        <Button variant="secondary" size="small">Secondary Small</Button>
        <Button variant="ghost-light" size="small">Ghost Small</Button>
      </div>
      <div style={{
      display: 'flex',
      gap: '16px'
    }}>
        <Button variant="primary" disabled>Disabled</Button>
        <Button variant="secondary" disabled>Disabled</Button>
        <Button variant="ghost-light" disabled>Disabled</Button>
      </div>
    </div>
}`,...g.parameters?.docs?.source}}};const B=["PrimaryLarge","PrimarySmall","SecondaryLarge","SecondarySmall","GhostLightLarge","GhostLightSmall","GhostDarkLarge","GhostDarkSmall","PrimaryDisabled","SecondaryDisabled","AllVariants"];export{g as AllVariants,l as GhostDarkLarge,d as GhostDarkSmall,i as GhostLightLarge,o as GhostLightSmall,c as PrimaryDisabled,e as PrimaryLarge,s as PrimarySmall,m as SecondaryDisabled,t as SecondaryLarge,n as SecondarySmall,B as __namedExportsOrder,v as default};
