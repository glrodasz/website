import{j as e}from"./jsx-runtime-u17CrQMm.js";import{R as u}from"./iframe-D7STJyU2.js";import{N as r}from"./NumberButton-8_4i4V2c.js";import"./preload-helper-PPVm8Dsz.js";const h={title:"Atoms/Navigation/NumberButton",component:r,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{size:{control:"radio",options:["small","large"],description:"Size of the button"},selected:{control:"boolean",description:"Selected/active state"},disabled:{control:"boolean",description:"Disabled state"},children:{control:"text",description:"Button content (typically a number)"}}},s={args:{children:"1",size:"large"}},a={args:{children:"2",size:"small"}},n={args:{children:"3",size:"large",selected:!0}},l={args:{children:"4",size:"large",disabled:!0}},i={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2rem"},children:[e.jsxs("div",{children:[e.jsx("h3",{style:{marginBottom:"1rem",fontSize:"14px",fontWeight:600},children:"Large Size"}),e.jsxs("div",{style:{display:"flex",gap:"0.5rem",alignItems:"center"},children:[e.jsx(r,{size:"large",children:"1"}),e.jsx(r,{size:"large",selected:!0,children:"2"}),e.jsx(r,{size:"large",children:"3"}),e.jsx(r,{size:"large",disabled:!0,children:"4"})]})]}),e.jsxs("div",{children:[e.jsx("h3",{style:{marginBottom:"1rem",fontSize:"14px",fontWeight:600},children:"Small Size"}),e.jsxs("div",{style:{display:"flex",gap:"0.5rem",alignItems:"center"},children:[e.jsx(r,{size:"small",children:"1"}),e.jsx(r,{size:"small",selected:!0,children:"2"}),e.jsx(r,{size:"small",children:"3"}),e.jsx(r,{size:"small",disabled:!0,children:"4"})]})]})]})},o={render:()=>e.jsxs("div",{style:{display:"flex",gap:"0.5rem",alignItems:"center"},children:[e.jsx(r,{size:"large",children:"1"}),e.jsx(r,{size:"large",selected:!0,children:"2"}),e.jsx(r,{size:"large",children:"3"}),e.jsx(r,{size:"large",children:"4"}),e.jsx(r,{size:"large",children:"5"}),e.jsx("span",{style:{padding:"0 0.5rem"},children:"..."}),e.jsx(r,{size:"large",children:"10"})]})},c={render:function(){const[d,m]=u.useState(1);return e.jsx("div",{style:{display:"flex",gap:"0.5rem",alignItems:"center"},children:[1,2,3,4,5].map(t=>e.jsx(r,{size:"large",selected:d===t,onClick:()=>m(t),"aria-label":`Page ${t}`,children:t},t))})}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    children: '1',
    size: 'large'
  }
}`,...s.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    children: '2',
    size: 'small'
  }
}`,...a.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    children: '3',
    size: 'large',
    selected: true
  }
}`,...n.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    children: '4',
    size: 'large',
    disabled: true
  }
}`,...l.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  }}>
      {/* Large size variants */}
      <div>
        <h3 style={{
        marginBottom: '1rem',
        fontSize: '14px',
        fontWeight: 600
      }}>Large Size</h3>
        <div style={{
        display: 'flex',
        gap: '0.5rem',
        alignItems: 'center'
      }}>
          <NumberButton size="large">1</NumberButton>
          <NumberButton size="large" selected>2</NumberButton>
          <NumberButton size="large">3</NumberButton>
          <NumberButton size="large" disabled>4</NumberButton>
        </div>
      </div>

      {/* Small size variants */}
      <div>
        <h3 style={{
        marginBottom: '1rem',
        fontSize: '14px',
        fontWeight: 600
      }}>Small Size</h3>
        <div style={{
        display: 'flex',
        gap: '0.5rem',
        alignItems: 'center'
      }}>
          <NumberButton size="small">1</NumberButton>
          <NumberButton size="small" selected>2</NumberButton>
          <NumberButton size="small">3</NumberButton>
          <NumberButton size="small" disabled>4</NumberButton>
        </div>
      </div>
    </div>
}`,...i.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center'
  }}>
      <NumberButton size="large">1</NumberButton>
      <NumberButton size="large" selected>2</NumberButton>
      <NumberButton size="large">3</NumberButton>
      <NumberButton size="large">4</NumberButton>
      <NumberButton size="large">5</NumberButton>
      <span style={{
      padding: '0 0.5rem'
    }}>...</span>
      <NumberButton size="large">10</NumberButton>
    </div>
}`,...o.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: function InteractiveStory() {
    const [selected, setSelected] = React.useState(1);
    return <div style={{
      display: 'flex',
      gap: '0.5rem',
      alignItems: 'center'
    }}>
        {[1, 2, 3, 4, 5].map(num => <NumberButton key={num} size="large" selected={selected === num} onClick={() => setSelected(num)} aria-label={\`Page \${num}\`}>
            {num}
          </NumberButton>)}
      </div>;
  }
}`,...c.parameters?.docs?.source}}};const B=["Default","Small","Selected","Disabled","AllVariants","PaginationExample","Interactive"];export{i as AllVariants,s as Default,l as Disabled,c as Interactive,o as PaginationExample,n as Selected,a as Small,B as __namedExportsOrder,h as default};
