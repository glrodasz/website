import{j as e}from"./jsx-runtime-u17CrQMm.js";import{R as z}from"./iframe-D7STJyU2.js";import"./preload-helper-PPVm8Dsz.js";const r=({size:x="large",label:t,error:s=!1,errorMessage:l,className:o="",disabled:i=!1,id:h,rows:b=4,...f})=>{const a="qd-textarea",n=h||`textarea-${Math.random().toString(36).substr(2,9)}`,v=[`${a}__wrapper`,o].filter(Boolean).join(" "),y=[`${a}__field`,`${a}__field--${x}`,s&&`${a}__field--error`,i&&`${a}__field--disabled`].filter(Boolean).join(" ");return e.jsxs("div",{className:v,children:[t&&e.jsx("label",{htmlFor:n,className:`${a}__label`,children:t}),e.jsx("textarea",{id:n,className:y,disabled:i,rows:b,"aria-invalid":s,"aria-describedby":s&&l?`${n}-error`:void 0,...f}),s&&l&&e.jsx("span",{id:`${n}-error`,className:`${a}__error-message`,children:l})]})};r.__docgenInfo={description:"",methods:[],displayName:"TextArea",props:{size:{required:!1,tsType:{name:"union",raw:"'small' | 'large'",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'large'"}]},description:"Size variant",defaultValue:{value:"'large'",computed:!1}},label:{required:!1,tsType:{name:"string"},description:"Textarea label"},error:{required:!1,tsType:{name:"boolean"},description:"Error state",defaultValue:{value:"false",computed:!1}},errorMessage:{required:!1,tsType:{name:"string"},description:"Error message to display"},className:{required:!1,tsType:{name:"string"},description:"Additional CSS class names",defaultValue:{value:"''",computed:!1}},disabled:{defaultValue:{value:"false",computed:!1},required:!1},rows:{defaultValue:{value:"4",computed:!1},required:!1}},composes:["Omit"]};const w={title:"Molecules/Input Fields/TextArea",component:r,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{size:{control:"radio",options:["small","large"]},label:{control:"text"},placeholder:{control:"text"},error:{control:"boolean"},errorMessage:{control:"text"},disabled:{control:"boolean"},rows:{control:"number"}}},d={args:{label:"Message",placeholder:"Enter your message",size:"large",rows:4}},c={args:{label:"Comment",placeholder:"Add a comment...",size:"small",rows:3}},m={args:{label:"Description",placeholder:"Enter description",size:"large",error:!0,errorMessage:"Description must be at least 10 characters",value:"Too short"}},p={args:{label:"Disabled Textarea",placeholder:"This textarea is disabled",size:"large",disabled:!0,value:"This content cannot be edited"}},u={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2rem",width:"500px"},children:[e.jsxs("div",{children:[e.jsx("h3",{style:{marginBottom:"1rem",fontSize:"14px",fontWeight:600},children:"Large Size"}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsx(r,{label:"Default",placeholder:"Enter text...",size:"large",rows:4}),e.jsx(r,{label:"Error",placeholder:"Enter text...",size:"large",rows:4,error:!0,errorMessage:"This field is required"}),e.jsx(r,{label:"Disabled",placeholder:"Disabled...",size:"large",rows:4,disabled:!0,value:"Disabled content"})]})]}),e.jsxs("div",{children:[e.jsx("h3",{style:{marginBottom:"1rem",fontSize:"14px",fontWeight:600},children:"Small Size"}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsx(r,{label:"Default",placeholder:"Enter text...",size:"small",rows:3}),e.jsx(r,{label:"Error",placeholder:"Enter text...",size:"small",rows:3,error:!0,errorMessage:"This field is required"}),e.jsx(r,{label:"Disabled",placeholder:"Disabled...",size:"small",rows:3,disabled:!0,value:"Disabled content"})]})]})]})},g={render:function(){const[t,s]=z.useState(""),l=200,o=l-t.length;return e.jsxs("div",{style:{width:"500px"},children:[e.jsx(r,{label:"Feedback",placeholder:"Share your thoughts...",size:"large",rows:5,value:t,onChange:i=>s(i.target.value),maxLength:l}),e.jsxs("p",{style:{marginTop:"0.5rem",fontSize:"12px",color:o<20?"#dc3545":"#666"},children:[o," characters remaining"]})]})}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Message',
    placeholder: 'Enter your message',
    size: 'large',
    rows: 4
  }
}`,...d.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Comment',
    placeholder: 'Add a comment...',
    size: 'small',
    rows: 3
  }
}`,...c.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Description',
    placeholder: 'Enter description',
    size: 'large',
    error: true,
    errorMessage: 'Description must be at least 10 characters',
    value: 'Too short'
  }
}`,...m.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Disabled Textarea',
    placeholder: 'This textarea is disabled',
    size: 'large',
    disabled: true,
    value: 'This content cannot be edited'
  }
}`,...p.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    width: '500px'
  }}>
      <div>
        <h3 style={{
        marginBottom: '1rem',
        fontSize: '14px',
        fontWeight: 600
      }}>Large Size</h3>
        <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
          <TextArea label="Default" placeholder="Enter text..." size="large" rows={4} />
          <TextArea label="Error" placeholder="Enter text..." size="large" rows={4} error errorMessage="This field is required" />
          <TextArea label="Disabled" placeholder="Disabled..." size="large" rows={4} disabled value="Disabled content" />
        </div>
      </div>

      <div>
        <h3 style={{
        marginBottom: '1rem',
        fontSize: '14px',
        fontWeight: 600
      }}>Small Size</h3>
        <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
          <TextArea label="Default" placeholder="Enter text..." size="small" rows={3} />
          <TextArea label="Error" placeholder="Enter text..." size="small" rows={3} error errorMessage="This field is required" />
          <TextArea label="Disabled" placeholder="Disabled..." size="small" rows={3} disabled value="Disabled content" />
        </div>
      </div>
    </div>
}`,...u.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: function InteractiveStory() {
    const [value, setValue] = React.useState('');
    const maxLength = 200;
    const remaining = maxLength - value.length;
    return <div style={{
      width: '500px'
    }}>
        <TextArea label="Feedback" placeholder="Share your thoughts..." size="large" rows={5} value={value} onChange={e => setValue(e.target.value)} maxLength={maxLength} />
        <p style={{
        marginTop: '0.5rem',
        fontSize: '12px',
        color: remaining < 20 ? '#dc3545' : '#666'
      }}>
          {remaining} characters remaining
        </p>
      </div>;
  }
}`,...g.parameters?.docs?.source}}};const j=["Default","Small","Error","Disabled","AllVariants","Interactive"];export{u as AllVariants,d as Default,p as Disabled,m as Error,g as Interactive,c as Small,j as __namedExportsOrder,w as default};
