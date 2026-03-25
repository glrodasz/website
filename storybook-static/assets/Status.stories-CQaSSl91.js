import{j as e}from"./jsx-runtime-u17CrQMm.js";import{S as s}from"./Status-BclkR0qI.js";import"./iframe-D7STJyU2.js";import"./preload-helper-PPVm8Dsz.js";const g={title:"Atoms/Information/Status",component:s,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{size:{control:"select",options:["lg","sm","xs"],description:"Size of the status indicator"},variant:{control:"select",options:["success","warning","error","neutral"],description:"Status variant determining the color"}}},a={args:{size:"lg",variant:"success"}},r={args:{size:"lg",variant:"warning"}},t={args:{size:"lg",variant:"error"}},i={args:{size:"lg",variant:"neutral"}},n={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2rem"},children:[e.jsxs("div",{children:[e.jsx("h3",{style:{marginBottom:"1rem",fontSize:"14px",fontWeight:600},children:"Large (lg)"}),e.jsxs("div",{style:{display:"flex",gap:"2rem",alignItems:"center"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[e.jsx(s,{size:"lg",variant:"success"}),e.jsx("span",{style:{fontSize:"14px"},children:"Success"})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[e.jsx(s,{size:"lg",variant:"warning"}),e.jsx("span",{style:{fontSize:"14px"},children:"Warning"})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[e.jsx(s,{size:"lg",variant:"error"}),e.jsx("span",{style:{fontSize:"14px"},children:"Error"})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[e.jsx(s,{size:"lg",variant:"neutral"}),e.jsx("span",{style:{fontSize:"14px"},children:"Neutral"})]})]})]}),e.jsxs("div",{children:[e.jsx("h3",{style:{marginBottom:"1rem",fontSize:"14px",fontWeight:600},children:"Small (sm)"}),e.jsxs("div",{style:{display:"flex",gap:"2rem",alignItems:"center"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[e.jsx(s,{size:"sm",variant:"success"}),e.jsx("span",{style:{fontSize:"14px"},children:"Success"})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[e.jsx(s,{size:"sm",variant:"warning"}),e.jsx("span",{style:{fontSize:"14px"},children:"Warning"})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[e.jsx(s,{size:"sm",variant:"error"}),e.jsx("span",{style:{fontSize:"14px"},children:"Error"})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[e.jsx(s,{size:"sm",variant:"neutral"}),e.jsx("span",{style:{fontSize:"14px"},children:"Neutral"})]})]})]}),e.jsxs("div",{children:[e.jsx("h3",{style:{marginBottom:"1rem",fontSize:"14px",fontWeight:600},children:"Extra Small (xs)"}),e.jsxs("div",{style:{display:"flex",gap:"2rem",alignItems:"center"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[e.jsx(s,{size:"xs",variant:"success"}),e.jsx("span",{style:{fontSize:"14px"},children:"Success"})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[e.jsx(s,{size:"xs",variant:"warning"}),e.jsx("span",{style:{fontSize:"14px"},children:"Warning"})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[e.jsx(s,{size:"xs",variant:"error"}),e.jsx("span",{style:{fontSize:"14px"},children:"Error"})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[e.jsx(s,{size:"xs",variant:"neutral"}),e.jsx("span",{style:{fontSize:"14px"},children:"Neutral"})]})]})]})]})},l={render:()=>e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem",width:"300px"},children:[{name:"Server 1",status:"success"},{name:"Server 2",status:"success"},{name:"Server 3",status:"warning"},{name:"Server 4",status:"error"},{name:"Server 5",status:"neutral"}].map((p,d)=>e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"0.75rem",padding:"0.75rem",border:"1px solid #e0e0e0",borderRadius:"4px"},children:[e.jsx(s,{size:"sm",variant:p.status}),e.jsx("span",{style:{fontSize:"14px"},children:p.name})]},d))})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    size: 'lg',
    variant: 'success'
  }
}`,...a.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    size: 'lg',
    variant: 'warning'
  }
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    size: 'lg',
    variant: 'error'
  }
}`,...t.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    size: 'lg',
    variant: 'neutral'
  }
}`,...i.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  }}>
      {/* Large size */}
      <div>
        <h3 style={{
        marginBottom: '1rem',
        fontSize: '14px',
        fontWeight: 600
      }}>Large (lg)</h3>
        <div style={{
        display: 'flex',
        gap: '2rem',
        alignItems: 'center'
      }}>
          <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
            <Status size="lg" variant="success" />
            <span style={{
            fontSize: '14px'
          }}>Success</span>
          </div>
          <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
            <Status size="lg" variant="warning" />
            <span style={{
            fontSize: '14px'
          }}>Warning</span>
          </div>
          <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
            <Status size="lg" variant="error" />
            <span style={{
            fontSize: '14px'
          }}>Error</span>
          </div>
          <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
            <Status size="lg" variant="neutral" />
            <span style={{
            fontSize: '14px'
          }}>Neutral</span>
          </div>
        </div>
      </div>

      {/* Small size */}
      <div>
        <h3 style={{
        marginBottom: '1rem',
        fontSize: '14px',
        fontWeight: 600
      }}>Small (sm)</h3>
        <div style={{
        display: 'flex',
        gap: '2rem',
        alignItems: 'center'
      }}>
          <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
            <Status size="sm" variant="success" />
            <span style={{
            fontSize: '14px'
          }}>Success</span>
          </div>
          <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
            <Status size="sm" variant="warning" />
            <span style={{
            fontSize: '14px'
          }}>Warning</span>
          </div>
          <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
            <Status size="sm" variant="error" />
            <span style={{
            fontSize: '14px'
          }}>Error</span>
          </div>
          <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
            <Status size="sm" variant="neutral" />
            <span style={{
            fontSize: '14px'
          }}>Neutral</span>
          </div>
        </div>
      </div>

      {/* Extra small size */}
      <div>
        <h3 style={{
        marginBottom: '1rem',
        fontSize: '14px',
        fontWeight: 600
      }}>Extra Small (xs)</h3>
        <div style={{
        display: 'flex',
        gap: '2rem',
        alignItems: 'center'
      }}>
          <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
            <Status size="xs" variant="success" />
            <span style={{
            fontSize: '14px'
          }}>Success</span>
          </div>
          <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
            <Status size="xs" variant="warning" />
            <span style={{
            fontSize: '14px'
          }}>Warning</span>
          </div>
          <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
            <Status size="xs" variant="error" />
            <span style={{
            fontSize: '14px'
          }}>Error</span>
          </div>
          <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
            <Status size="xs" variant="neutral" />
            <span style={{
            fontSize: '14px'
          }}>Neutral</span>
          </div>
        </div>
      </div>
    </div>
}`,...n.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    width: '300px'
  }}>
      {[{
      name: 'Server 1',
      status: 'success' as const
    }, {
      name: 'Server 2',
      status: 'success' as const
    }, {
      name: 'Server 3',
      status: 'warning' as const
    }, {
      name: 'Server 4',
      status: 'error' as const
    }, {
      name: 'Server 5',
      status: 'neutral' as const
    }].map((item, index) => <div key={index} style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.75rem',
      border: '1px solid #e0e0e0',
      borderRadius: '4px'
    }}>
          <Status size="sm" variant={item.status} />
          <span style={{
        fontSize: '14px'
      }}>{item.name}</span>
        </div>)}
    </div>
}`,...l.parameters?.docs?.source}}};const v=["Success","Warning","Error","Neutral","AllVariants","InListExample"];export{n as AllVariants,t as Error,l as InListExample,i as Neutral,a as Success,r as Warning,v as __namedExportsOrder,g as default};
