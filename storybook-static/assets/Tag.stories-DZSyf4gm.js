import{j as e}from"./jsx-runtime-u17CrQMm.js";import{R as p}from"./iframe-D7STJyU2.js";import{T as a}from"./Tag-Ba0XjyvK.js";import"./preload-helper-PPVm8Dsz.js";import"./IconBase.esm-A2qEZsqF.js";const j={title:"Atoms/Information/Tag",component:a,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{size:{control:"radio",options:["small","large"],description:"Size of the tag"},variant:{control:"select",options:["discovery","info","success","warning","error","neutral"],description:"Semantic variant determining the color"},outlined:{control:"boolean",description:"Use outlined style instead of filled"},children:{control:"text",description:"Tag content/label"}}},i={args:{children:"Tag",size:"large",variant:"neutral"}},s={args:{children:"Closeable",size:"large",variant:"info",onClose:()=>alert("Tag closed!")}},l={args:{children:"Small Tag",size:"small",variant:"success"}},n={args:{children:"Outlined",size:"large",variant:"warning",outlined:!0}},t={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2rem"},children:[e.jsxs("div",{children:[e.jsx("h3",{style:{marginBottom:"1rem",fontSize:"14px",fontWeight:600},children:"Large Filled"}),e.jsxs("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap"},children:[e.jsx(a,{size:"large",variant:"discovery",children:"Discovery"}),e.jsx(a,{size:"large",variant:"info",children:"Info"}),e.jsx(a,{size:"large",variant:"success",children:"Success"}),e.jsx(a,{size:"large",variant:"warning",children:"Warning"}),e.jsx(a,{size:"large",variant:"error",children:"Error"}),e.jsx(a,{size:"large",variant:"neutral",children:"Neutral"})]})]}),e.jsxs("div",{children:[e.jsx("h3",{style:{marginBottom:"1rem",fontSize:"14px",fontWeight:600},children:"Small Filled"}),e.jsxs("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap"},children:[e.jsx(a,{size:"small",variant:"discovery",children:"Discovery"}),e.jsx(a,{size:"small",variant:"info",children:"Info"}),e.jsx(a,{size:"small",variant:"success",children:"Success"}),e.jsx(a,{size:"small",variant:"warning",children:"Warning"}),e.jsx(a,{size:"small",variant:"error",children:"Error"}),e.jsx(a,{size:"small",variant:"neutral",children:"Neutral"})]})]})]})},o={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2rem"},children:[e.jsxs("div",{children:[e.jsx("h3",{style:{marginBottom:"1rem",fontSize:"14px",fontWeight:600},children:"Large Outlined"}),e.jsxs("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap"},children:[e.jsx(a,{size:"large",variant:"discovery",outlined:!0,children:"Discovery"}),e.jsx(a,{size:"large",variant:"info",outlined:!0,children:"Info"}),e.jsx(a,{size:"large",variant:"success",outlined:!0,children:"Success"}),e.jsx(a,{size:"large",variant:"warning",outlined:!0,children:"Warning"}),e.jsx(a,{size:"large",variant:"error",outlined:!0,children:"Error"}),e.jsx(a,{size:"large",variant:"neutral",outlined:!0,children:"Neutral"})]})]}),e.jsxs("div",{children:[e.jsx("h3",{style:{marginBottom:"1rem",fontSize:"14px",fontWeight:600},children:"Small Outlined"}),e.jsxs("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap"},children:[e.jsx(a,{size:"small",variant:"discovery",outlined:!0,children:"Discovery"}),e.jsx(a,{size:"small",variant:"info",outlined:!0,children:"Info"}),e.jsx(a,{size:"small",variant:"success",outlined:!0,children:"Success"}),e.jsx(a,{size:"small",variant:"warning",outlined:!0,children:"Warning"}),e.jsx(a,{size:"small",variant:"error",outlined:!0,children:"Error"}),e.jsx(a,{size:"small",variant:"neutral",outlined:!0,children:"Neutral"})]})]})]})},d={render:()=>e.jsxs("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap"},children:[e.jsx(a,{size:"large",variant:"discovery",onClose:()=>console.log("Removed"),children:"Discovery"}),e.jsx(a,{size:"large",variant:"info",onClose:()=>console.log("Removed"),children:"Info"}),e.jsx(a,{size:"large",variant:"success",onClose:()=>console.log("Removed"),children:"Success"}),e.jsx(a,{size:"large",variant:"warning",onClose:()=>console.log("Removed"),children:"Warning"}),e.jsx(a,{size:"large",variant:"error",onClose:()=>console.log("Removed"),children:"Error"}),e.jsx(a,{size:"large",variant:"neutral",onClose:()=>console.log("Removed"),children:"Neutral"})]})},c={render:function(){const[g,v]=p.useState([{id:1,label:"React",variant:"info"},{id:2,label:"TypeScript",variant:"discovery"},{id:3,label:"Storybook",variant:"success"},{id:4,label:"Design Tokens",variant:"warning"}]),m=r=>{v(g.filter(u=>u.id!==r))};return e.jsxs("div",{children:[e.jsxs("h4",{style:{marginBottom:"1rem",fontSize:"14px",fontWeight:600},children:["Active Filters (",g.length,")"]}),e.jsx("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap"},children:g.map(r=>e.jsx(a,{size:"large",variant:r.variant,onClose:()=>m(r.id),children:r.label},r.id))})]})}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Tag',
    size: 'large',
    variant: 'neutral'
  }
}`,...i.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Closeable',
    size: 'large',
    variant: 'info',
    onClose: () => alert('Tag closed!')
  }
}`,...s.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Small Tag',
    size: 'small',
    variant: 'success'
  }
}`,...l.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Outlined',
    size: 'large',
    variant: 'warning',
    outlined: true
  }
}`,...n.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  }}>
      {/* Large filled */}
      <div>
        <h3 style={{
        marginBottom: '1rem',
        fontSize: '14px',
        fontWeight: 600
      }}>Large Filled</h3>
        <div style={{
        display: 'flex',
        gap: '0.5rem',
        flexWrap: 'wrap'
      }}>
          <Tag size="large" variant="discovery">Discovery</Tag>
          <Tag size="large" variant="info">Info</Tag>
          <Tag size="large" variant="success">Success</Tag>
          <Tag size="large" variant="warning">Warning</Tag>
          <Tag size="large" variant="error">Error</Tag>
          <Tag size="large" variant="neutral">Neutral</Tag>
        </div>
      </div>

      {/* Small filled */}
      <div>
        <h3 style={{
        marginBottom: '1rem',
        fontSize: '14px',
        fontWeight: 600
      }}>Small Filled</h3>
        <div style={{
        display: 'flex',
        gap: '0.5rem',
        flexWrap: 'wrap'
      }}>
          <Tag size="small" variant="discovery">Discovery</Tag>
          <Tag size="small" variant="info">Info</Tag>
          <Tag size="small" variant="success">Success</Tag>
          <Tag size="small" variant="warning">Warning</Tag>
          <Tag size="small" variant="error">Error</Tag>
          <Tag size="small" variant="neutral">Neutral</Tag>
        </div>
      </div>
    </div>
}`,...t.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  }}>
      {/* Large outlined */}
      <div>
        <h3 style={{
        marginBottom: '1rem',
        fontSize: '14px',
        fontWeight: 600
      }}>Large Outlined</h3>
        <div style={{
        display: 'flex',
        gap: '0.5rem',
        flexWrap: 'wrap'
      }}>
          <Tag size="large" variant="discovery" outlined>Discovery</Tag>
          <Tag size="large" variant="info" outlined>Info</Tag>
          <Tag size="large" variant="success" outlined>Success</Tag>
          <Tag size="large" variant="warning" outlined>Warning</Tag>
          <Tag size="large" variant="error" outlined>Error</Tag>
          <Tag size="large" variant="neutral" outlined>Neutral</Tag>
        </div>
      </div>

      {/* Small outlined */}
      <div>
        <h3 style={{
        marginBottom: '1rem',
        fontSize: '14px',
        fontWeight: 600
      }}>Small Outlined</h3>
        <div style={{
        display: 'flex',
        gap: '0.5rem',
        flexWrap: 'wrap'
      }}>
          <Tag size="small" variant="discovery" outlined>Discovery</Tag>
          <Tag size="small" variant="info" outlined>Info</Tag>
          <Tag size="small" variant="success" outlined>Success</Tag>
          <Tag size="small" variant="warning" outlined>Warning</Tag>
          <Tag size="small" variant="error" outlined>Error</Tag>
          <Tag size="small" variant="neutral" outlined>Neutral</Tag>
        </div>
      </div>
    </div>
}`,...o.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap'
  }}>
      <Tag size="large" variant="discovery" onClose={() => console.log('Removed')}>Discovery</Tag>
      <Tag size="large" variant="info" onClose={() => console.log('Removed')}>Info</Tag>
      <Tag size="large" variant="success" onClose={() => console.log('Removed')}>Success</Tag>
      <Tag size="large" variant="warning" onClose={() => console.log('Removed')}>Warning</Tag>
      <Tag size="large" variant="error" onClose={() => console.log('Removed')}>Error</Tag>
      <Tag size="large" variant="neutral" onClose={() => console.log('Removed')}>Neutral</Tag>
    </div>
}`,...d.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: function FilterStory() {
    const [tags, setTags] = React.useState([{
      id: 1,
      label: 'React',
      variant: 'info' as const
    }, {
      id: 2,
      label: 'TypeScript',
      variant: 'discovery' as const
    }, {
      id: 3,
      label: 'Storybook',
      variant: 'success' as const
    }, {
      id: 4,
      label: 'Design Tokens',
      variant: 'warning' as const
    }]);
    const removeTag = (id: number) => {
      setTags(tags.filter(tag => tag.id !== id));
    };
    return <div>
        <h4 style={{
        marginBottom: '1rem',
        fontSize: '14px',
        fontWeight: 600
      }}>
          Active Filters ({tags.length})
        </h4>
        <div style={{
        display: 'flex',
        gap: '0.5rem',
        flexWrap: 'wrap'
      }}>
          {tags.map(tag => <Tag key={tag.id} size="large" variant={tag.variant} onClose={() => removeTag(tag.id)}>
              {tag.label}
            </Tag>)}
        </div>
      </div>;
  }
}`,...c.parameters?.docs?.source}}};const S=["Default","WithCloseButton","Small","Outlined","AllVariantsFilled","AllVariantsOutlined","WithCloseButtons","FilterExample"];export{t as AllVariantsFilled,o as AllVariantsOutlined,i as Default,c as FilterExample,n as Outlined,l as Small,s as WithCloseButton,d as WithCloseButtons,S as __namedExportsOrder,j as default};
