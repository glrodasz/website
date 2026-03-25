import{j as e}from"./jsx-runtime-u17CrQMm.js";import{R as g}from"./iframe-D7STJyU2.js";import{C as t}from"./CheckButton-BULpUXbt.js";import"./preload-helper-PPVm8Dsz.js";import"./Check.esm-CzB6_zDH.js";import"./IconBase.esm-A2qEZsqF.js";const j={title:"Atoms/Navigation/CheckButton",component:t,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{size:{control:"radio",options:["small","large"],description:"Size of the button"},active:{control:"boolean",description:"Active/completed state"},disabled:{control:"boolean",description:"Disabled state"},label:{control:"text",description:"Optional label text"}}},i={args:{size:"large",active:!1}},l={args:{size:"large",active:!0}},n={args:{size:"small",active:!1}},o={args:{size:"small",active:!0}},c={args:{size:"large",active:!1,disabled:!0}},d={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2rem"},children:[e.jsxs("div",{children:[e.jsx("h3",{style:{marginBottom:"1rem",fontSize:"14px",fontWeight:600},children:"Large Size"}),e.jsxs("div",{style:{display:"flex",gap:"1rem",alignItems:"center"},children:[e.jsx(t,{size:"large"}),e.jsx(t,{size:"large",active:!0}),e.jsx(t,{size:"large",disabled:!0}),e.jsx(t,{size:"large",active:!0,disabled:!0})]})]}),e.jsxs("div",{children:[e.jsx("h3",{style:{marginBottom:"1rem",fontSize:"14px",fontWeight:600},children:"Small Size"}),e.jsxs("div",{style:{display:"flex",gap:"1rem",alignItems:"center"},children:[e.jsx(t,{size:"small"}),e.jsx(t,{size:"small",active:!0}),e.jsx(t,{size:"small",disabled:!0}),e.jsx(t,{size:"small",active:!0,disabled:!0})]})]})]})},p={render:()=>e.jsxs("div",{style:{display:"flex",gap:"1rem",alignItems:"center"},children:[e.jsx(t,{size:"large",active:!0,"aria-label":"Step 1 completed"}),e.jsx("div",{style:{width:"60px",height:"2px",backgroundColor:"#006E7A"}}),e.jsx(t,{size:"large",active:!0,"aria-label":"Step 2 completed"}),e.jsx("div",{style:{width:"60px",height:"2px",backgroundColor:"#006E7A"}}),e.jsx(t,{size:"large","aria-label":"Step 3 not completed"}),e.jsx("div",{style:{width:"60px",height:"2px",backgroundColor:"#ddd"}}),e.jsx(t,{size:"large","aria-label":"Step 4 not completed"})]})},m={render:function(){const[r,u]=g.useState([!0,!0,!1,!1]),x=s=>{const a=[...r];a[s]=!a[s],u(a)};return e.jsx("div",{style:{display:"flex",gap:"1rem",alignItems:"center"},children:r.map((s,a)=>e.jsxs(g.Fragment,{children:[e.jsx(t,{size:"large",active:s,onClick:()=>x(a),"aria-label":`Step ${a+1} ${s?"completed":"not completed"}`}),a<r.length-1&&e.jsx("div",{style:{width:"60px",height:"2px",backgroundColor:s&&r[a+1]?"#006E7A":"#ddd"}})]},a))})}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    size: 'large',
    active: false
  }
}`,...i.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    size: 'large',
    active: true
  }
}`,...l.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    size: 'small',
    active: false
  }
}`,...n.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    size: 'small',
    active: true
  }
}`,...o.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    size: 'large',
    active: false,
    disabled: true
  }
}`,...c.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
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
        gap: '1rem',
        alignItems: 'center'
      }}>
          <CheckButton size="large" />
          <CheckButton size="large" active />
          <CheckButton size="large" disabled />
          <CheckButton size="large" active disabled />
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
        gap: '1rem',
        alignItems: 'center'
      }}>
          <CheckButton size="small" />
          <CheckButton size="small" active />
          <CheckButton size="small" disabled />
          <CheckButton size="small" active disabled />
        </div>
      </div>
    </div>
}`,...d.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: '1rem',
    alignItems: 'center'
  }}>
      <CheckButton size="large" active aria-label="Step 1 completed" />
      <div style={{
      width: '60px',
      height: '2px',
      backgroundColor: '#006E7A'
    }} />
      <CheckButton size="large" active aria-label="Step 2 completed" />
      <div style={{
      width: '60px',
      height: '2px',
      backgroundColor: '#006E7A'
    }} />
      <CheckButton size="large" aria-label="Step 3 not completed" />
      <div style={{
      width: '60px',
      height: '2px',
      backgroundColor: '#ddd'
    }} />
      <CheckButton size="large" aria-label="Step 4 not completed" />
    </div>
}`,...p.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: function InteractiveStory() {
    const [steps, setSteps] = React.useState([true, true, false, false]);
    const toggleStep = (index: number) => {
      const newSteps = [...steps];
      newSteps[index] = !newSteps[index];
      setSteps(newSteps);
    };
    return <div style={{
      display: 'flex',
      gap: '1rem',
      alignItems: 'center'
    }}>
        {steps.map((isActive, index) => <React.Fragment key={index}>
            <CheckButton size="large" active={isActive} onClick={() => toggleStep(index)} aria-label={\`Step \${index + 1} \${isActive ? 'completed' : 'not completed'}\`} />
            {index < steps.length - 1 && <div style={{
          width: '60px',
          height: '2px',
          backgroundColor: isActive && steps[index + 1] ? '#006E7A' : '#ddd'
        }} />}
          </React.Fragment>)}
      </div>;
  }
}`,...m.parameters?.docs?.source}}};const k=["Default","Active","Small","SmallActive","Disabled","AllVariants","StepIndicatorExample","Interactive"];export{l as Active,d as AllVariants,i as Default,c as Disabled,m as Interactive,n as Small,o as SmallActive,p as StepIndicatorExample,k as __namedExportsOrder,j as default};
