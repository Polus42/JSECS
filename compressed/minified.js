let ECS={};ECS.Entity=function Entity(){this.id=ECS.Entity.prototype._count;ECS.Entity.prototype._count++;this.components={};this.componentsNames=[];return this};ECS.Entity.prototype._count=0;function containsAll(needles,haystack){return needles.every((val)=>haystack.includes(val))}
ECS.Entity.prototype.addComponent=function addComponent(component){if(this.components[component.name]!=undefined)
return this;this.components[component.name]=component;this.componentsNames.push(component.name);for(let i=0;i<ECS.System.AllSystems.length;i++){const element=ECS.System.AllSystems[i];if(containsAll(element.dependencies,this.componentsNames))
{element.subscribedEntities.push(this)}}
return this};ECS.Entity.prototype.removeComponent=function removeComponent(componentName){var name=componentName;if(typeof componentName==='function'){name=componentName.prototype.name}
for(let i=0;i<ECS.System.AllSystems.length;i++){const element=ECS.System.AllSystems[i];if(containsAll(element.dependencies,this.componentsNames))
{element.subscribedEntities.splice(element.subscribedEntities.indexOf(this),1)}}
delete this.components[name];this.componentsNames.splice(this.componentsNames.indexOf(name),1);return this};ECS.Entity.prototype.print=function print(){console.log(JSON.stringify(this,null,4));return this};ECS.Components={};ECS.Components.Size=function ComponentSize(value){this.value=value||0;return this}
ECS.Components.Size.prototype.name='size';ECS.System=function System(func,requireList){this.subscribedEntities=[];this.dependencies=requireList;this.function=func;ECS.System.AllSystems.push(this)}
ECS.System.AllSystems=[];ECS.System.prototype.Execute=function Execute()
{for(let i=0;i<this.subscribedEntities.length;i++){const element=this.function(this.subscribedEntities[i])}}
let drawSystem=new ECS.System(e=>{console.log(e)},["size"]);x=a.getContext`2d`;x.fillStyle='rgb(200,0,0)';x.fillRect(10,10,50,50);setInterval(e=>{update()},33);let e=new ECS.Entity();let e2=new ECS.Entity();e.addComponent(new ECS.Components.Size(10));function update(){for(let index=0;index<ECS.System.AllSystems.length;index++){ECS.System.AllSystems[index].Execute()}}
document.addEventListener('keydown',function(event){if(event.keyCode==37){e.removeComponent("size")}
else if(event.keyCode==39){e2.addComponent(new ECS.Components.Size(Math.random()))}})