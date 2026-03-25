import{j as a}from"./jsx-runtime-u17CrQMm.js";import{T as e}from"./Typography-CYxU4y7s.js";import"./iframe-D7STJyU2.js";import"./preload-helper-PPVm8Dsz.js";const m={title:"Atoms/Typography",component:e,parameters:{layout:"padded"},tags:["autodocs"],argTypes:{variant:{control:"select",options:["display","heading","title","subtitle","paragraph","label","button"],description:"Typography variant from Quantum Design system"},as:{control:"select",options:["h1","h2","h3","h4","h5","h6","p","span","label"],description:"HTML element to render"}}},r={args:{variant:"display",children:"Display Text - Large and Bold"}},t={args:{variant:"heading",children:"Heading Text - For Major Sections"}},n={args:{variant:"title",children:"Title Text - For Subsections"}},s={args:{variant:"subtitle",children:"Subtitle Text - For Supporting Information"}},i={args:{variant:"paragraph",children:"Paragraph text for body content. This is the standard text style used throughout the application for readable content."}},o={args:{variant:"label",children:"Label Text"}},p={args:{variant:"button",children:"Button Text"}},c={render:()=>a.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"24px"},children:[a.jsx(e,{variant:"display",children:"Display Text"}),a.jsx(e,{variant:"heading",children:"Heading Text"}),a.jsx(e,{variant:"title",children:"Title Text"}),a.jsx(e,{variant:"subtitle",children:"Subtitle Text"}),a.jsx(e,{variant:"paragraph",children:"Paragraph text for body content. Lorem ipsum dolor sit amet, consectetur adipiscing elit."}),a.jsx(e,{variant:"label",children:"Label Text"}),a.jsx(e,{variant:"button",children:"Button Text"})]})},l={render:()=>a.jsxs("div",{style:{maxWidth:"640px"},children:[a.jsx(e,{variant:"display",as:"h1",children:"Quantum Design System"}),a.jsx(e,{variant:"paragraph",as:"p",style:{marginTop:"16px"},children:"A comprehensive design system with three-level token hierarchy: Global, System, and Component tokens."}),a.jsx(e,{variant:"heading",as:"h2",style:{marginTop:"32px"},children:"Typography Guidelines"}),a.jsx(e,{variant:"paragraph",as:"p",style:{marginTop:"16px"},children:"The typography system provides consistent text styles across the entire application. Each variant serves a specific purpose in the content hierarchy."}),a.jsx(e,{variant:"title",as:"h3",style:{marginTop:"24px"},children:"Using Typography Components"}),a.jsx(e,{variant:"paragraph",as:"p",style:{marginTop:"12px"},children:"Typography components automatically apply the correct font size, weight, line height, and spacing according to the Quantum Design specifications."})]})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'display',
    children: 'Display Text - Large and Bold'
  }
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'heading',
    children: 'Heading Text - For Major Sections'
  }
}`,...t.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'title',
    children: 'Title Text - For Subsections'
  }
}`,...n.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'subtitle',
    children: 'Subtitle Text - For Supporting Information'
  }
}`,...s.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'paragraph',
    children: 'Paragraph text for body content. This is the standard text style used throughout the application for readable content.'
  }
}`,...i.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'label',
    children: 'Label Text'
  }
}`,...o.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'button',
    children: 'Button Text'
  }
}`,...p.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  }}>
      <Typography variant="display">Display Text</Typography>
      <Typography variant="heading">Heading Text</Typography>
      <Typography variant="title">Title Text</Typography>
      <Typography variant="subtitle">Subtitle Text</Typography>
      <Typography variant="paragraph">
        Paragraph text for body content. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </Typography>
      <Typography variant="label">Label Text</Typography>
      <Typography variant="button">Button Text</Typography>
    </div>
}`,...c.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    maxWidth: '640px'
  }}>
      <Typography variant="display" as="h1">
        Quantum Design System
      </Typography>
      <Typography variant="paragraph" as="p" style={{
      marginTop: '16px'
    }}>
        A comprehensive design system with three-level token hierarchy: Global, System, and Component tokens.
      </Typography>

      <Typography variant="heading" as="h2" style={{
      marginTop: '32px'
    }}>
        Typography Guidelines
      </Typography>
      <Typography variant="paragraph" as="p" style={{
      marginTop: '16px'
    }}>
        The typography system provides consistent text styles across the entire application. Each variant serves a specific purpose in the content hierarchy.
      </Typography>

      <Typography variant="title" as="h3" style={{
      marginTop: '24px'
    }}>
        Using Typography Components
      </Typography>
      <Typography variant="paragraph" as="p" style={{
      marginTop: '12px'
    }}>
        Typography components automatically apply the correct font size, weight, line height, and spacing according to the Quantum Design specifications.
      </Typography>
    </div>
}`,...l.parameters?.docs?.source}}};const T=["Display","Heading","Title","Subtitle","Paragraph","Label","ButtonText","TypographyScale","ContentExample"];export{p as ButtonText,l as ContentExample,r as Display,t as Heading,o as Label,i as Paragraph,s as Subtitle,n as Title,c as TypographyScale,T as __namedExportsOrder,m as default};
