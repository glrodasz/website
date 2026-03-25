import{j as e}from"./jsx-runtime-u17CrQMm.js";import{L as a}from"./Logo-BnSdjmSp.js";import"./iframe-D7STJyU2.js";import"./preload-helper-PPVm8Dsz.js";const f={title:"Atoms/Information/Logo",component:a,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{variant:{control:"radio",options:["default","contrast"],description:"Color variant (default for dark bg, contrast for light bg)"},size:{control:"radio",options:["small","large"],description:"Size variant (small = icon only, large = icon + text)"}}},r={args:{variant:"default",size:"large"}},t={args:{variant:"default",size:"small"}},o={args:{variant:"contrast",size:"large"},parameters:{backgrounds:{default:"dark"}}},n={args:{variant:"contrast",size:"small"},parameters:{backgrounds:{default:"dark"}}},s={args:{variant:"default",size:"large",onClick:()=>alert("Logo clicked! Navigate to home.")}},l={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"3rem"},children:[e.jsxs("div",{children:[e.jsx("h3",{style:{marginBottom:"1.5rem",fontSize:"14px",fontWeight:600},children:"Default Variant (for light backgrounds)"}),e.jsxs("div",{style:{display:"flex",gap:"2rem",alignItems:"center",padding:"2rem",backgroundColor:"#f5f5f5",borderRadius:"8px"},children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"0.5rem"},children:[e.jsx(a,{variant:"default",size:"large"}),e.jsx("span",{style:{fontSize:"12px",color:"#666"},children:"Large"})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"0.5rem"},children:[e.jsx(a,{variant:"default",size:"small"}),e.jsx("span",{style:{fontSize:"12px",color:"#666"},children:"Small"})]})]})]}),e.jsxs("div",{children:[e.jsx("h3",{style:{marginBottom:"1.5rem",fontSize:"14px",fontWeight:600},children:"Contrast Variant (for dark backgrounds)"}),e.jsxs("div",{style:{display:"flex",gap:"2rem",alignItems:"center",padding:"2rem",backgroundColor:"#1a1a1a",borderRadius:"8px"},children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"0.5rem"},children:[e.jsx(a,{variant:"contrast",size:"large"}),e.jsx("span",{style:{fontSize:"12px",color:"#ccc"},children:"Large"})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"0.5rem"},children:[e.jsx(a,{variant:"contrast",size:"small"}),e.jsx("span",{style:{fontSize:"12px",color:"#ccc"},children:"Small"})]})]})]})]})},i={render:()=>e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"1rem 2rem",backgroundColor:"#fff",borderBottom:"1px solid #e0e0e0",width:"600px"},children:[e.jsx(a,{variant:"default",size:"large",onClick:()=>console.log("Navigate to home")}),e.jsxs("nav",{style:{display:"flex",gap:"2rem",fontSize:"14px"},children:[e.jsx("a",{href:"#",style:{color:"#333",textDecoration:"none"},children:"Products"}),e.jsx("a",{href:"#",style:{color:"#333",textDecoration:"none"},children:"About"}),e.jsx("a",{href:"#",style:{color:"#333",textDecoration:"none"},children:"Contact"})]})]})},c={render:()=>e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"1rem 2rem",backgroundColor:"#1a1a1a",borderBottom:"1px solid #333",width:"600px"},children:[e.jsx(a,{variant:"contrast",size:"large",onClick:()=>console.log("Navigate to home")}),e.jsxs("nav",{style:{display:"flex",gap:"2rem",fontSize:"14px"},children:[e.jsx("a",{href:"#",style:{color:"#fff",textDecoration:"none"},children:"Products"}),e.jsx("a",{href:"#",style:{color:"#fff",textDecoration:"none"},children:"About"}),e.jsx("a",{href:"#",style:{color:"#fff",textDecoration:"none"},children:"Contact"})]})]})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'default',
    size: 'large'
  }
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'default',
    size: 'small'
  }
}`,...t.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'contrast',
    size: 'large'
  },
  parameters: {
    backgrounds: {
      default: 'dark'
    }
  }
}`,...o.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'contrast',
    size: 'small'
  },
  parameters: {
    backgrounds: {
      default: 'dark'
    }
  }
}`,...n.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'default',
    size: 'large',
    onClick: () => alert('Logo clicked! Navigate to home.')
  }
}`,...s.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '3rem'
  }}>
      {/* Default variant */}
      <div>
        <h3 style={{
        marginBottom: '1.5rem',
        fontSize: '14px',
        fontWeight: 600
      }}>
          Default Variant (for light backgrounds)
        </h3>
        <div style={{
        display: 'flex',
        gap: '2rem',
        alignItems: 'center',
        padding: '2rem',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px'
      }}>
          <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
            <Logo variant="default" size="large" />
            <span style={{
            fontSize: '12px',
            color: '#666'
          }}>Large</span>
          </div>
          <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
            <Logo variant="default" size="small" />
            <span style={{
            fontSize: '12px',
            color: '#666'
          }}>Small</span>
          </div>
        </div>
      </div>

      {/* Contrast variant */}
      <div>
        <h3 style={{
        marginBottom: '1.5rem',
        fontSize: '14px',
        fontWeight: 600
      }}>
          Contrast Variant (for dark backgrounds)
        </h3>
        <div style={{
        display: 'flex',
        gap: '2rem',
        alignItems: 'center',
        padding: '2rem',
        backgroundColor: '#1a1a1a',
        borderRadius: '8px'
      }}>
          <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
            <Logo variant="contrast" size="large" />
            <span style={{
            fontSize: '12px',
            color: '#ccc'
          }}>Large</span>
          </div>
          <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
            <Logo variant="contrast" size="small" />
            <span style={{
            fontSize: '12px',
            color: '#ccc'
          }}>Small</span>
          </div>
        </div>
      </div>
    </div>
}`,...l.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem 2rem',
    backgroundColor: '#fff',
    borderBottom: '1px solid #e0e0e0',
    width: '600px'
  }}>
      <Logo variant="default" size="large" onClick={() => console.log('Navigate to home')} />
      <nav style={{
      display: 'flex',
      gap: '2rem',
      fontSize: '14px'
    }}>
        <a href="#" style={{
        color: '#333',
        textDecoration: 'none'
      }}>Products</a>
        <a href="#" style={{
        color: '#333',
        textDecoration: 'none'
      }}>About</a>
        <a href="#" style={{
        color: '#333',
        textDecoration: 'none'
      }}>Contact</a>
      </nav>
    </div>
}`,...i.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem 2rem',
    backgroundColor: '#1a1a1a',
    borderBottom: '1px solid #333',
    width: '600px'
  }}>
      <Logo variant="contrast" size="large" onClick={() => console.log('Navigate to home')} />
      <nav style={{
      display: 'flex',
      gap: '2rem',
      fontSize: '14px'
    }}>
        <a href="#" style={{
        color: '#fff',
        textDecoration: 'none'
      }}>Products</a>
        <a href="#" style={{
        color: '#fff',
        textDecoration: 'none'
      }}>About</a>
        <a href="#" style={{
        color: '#fff',
        textDecoration: 'none'
      }}>Contact</a>
      </nav>
    </div>
}`,...c.parameters?.docs?.source}}};const x=["Default","DefaultSmall","Contrast","ContrastSmall","Clickable","AllVariants","InNavigationExample","InDarkNavigationExample"];export{l as AllVariants,s as Clickable,o as Contrast,n as ContrastSmall,r as Default,t as DefaultSmall,c as InDarkNavigationExample,i as InNavigationExample,x as __namedExportsOrder,f as default};
