// Core ////////////////////////////////////////////////////////////////////////////////////
let ECS = {};
ECS.Entity = function Entity(){
    // Generate a pseudo random ID
    this.id = ECS.Entity.prototype._count;

    // increment counter
    ECS.Entity.prototype._count++;

    // The component data will live in this object
    this.components = {};

    return this;
};
// keep track of entities created
ECS.Entity.prototype._count = 0;

ECS.Entity.prototype.addComponent = function addComponent ( component ){
    // Add component data to the entity
    // NOTE: The component must have a name property (which is defined as 
    // a prototype protoype of a component function)
    if(this.components[component.name]!=undefined)
        return this;
      this.components[component.name] = component;
            for (let i = 0; i < ECS.System.AllSystems.length; i++) {
                const element = ECS.System.AllSystems[i];
                if(element.CanAdd(this))
                {
                    element.subscribedEntities.push(this);
                }
            }
    return this;
};
ECS.Entity.prototype.removeComponent = function removeComponent ( componentName ){
    // Remove component data by removing the reference to it.
    // Allows either a component function or a string of a component name to be
    // passed in
    var name = componentName; // assume a string was passed in

    if(typeof componentName === 'function'){ 
        // get the name from the prototype of the passed component function
        name = componentName.prototype.name;
    }

    for (let i = 0; i < ECS.System.AllSystems.length; i++) {
        const element = ECS.System.AllSystems[i];
        if(element.CanAdd(this))
        {
            element.subscribedEntities.splice(element.subscribedEntities.indexOf(this),1);
        }
    }

    // Remove component data by removing the reference to it
    delete this.components[name];
    return this;
};

ECS.Entity.prototype.print = function print () {
    // Function to print / log information about the entity
    console.log(JSON.stringify(this, null, 4));
    return this;
};
// Components ////////////////////////////////////////////////////////////////////////////////////
ECS.Components = {};
ECS.Components.Size = function ComponentSize(value) {
    this.value = value ||0;
    return this;
}
ECS.Components.Size.prototype.name = 'size';
// Systems ////////////////////////////////////////////////////////////////////////////////////
ECS.System = function System(func,requireList) {
    this.subscribedEntities = [];
    this.dependencies = requireList;
    this.function = func;
    ECS.System.AllSystems.push(this);
}
ECS.System.AllSystems = [];
ECS.System.prototype.Execute = function Execute()
{
    for (let i = 0; i < this.subscribedEntities.length; i++) {
        const element = this.function(this.subscribedEntities[i]);
    }
}
ECS.System.prototype.CanAdd = function CanAdd(entity) {
    return this.dependencies.every((val) => entity.components[val]!=undefined);
}
let drawSystem = new ECS.System(e=>{console.log(e)},["size"]);
/*function drawSystem(entities)
{
    for (let index = 0; index < entities.length; index++) {
        const element = entities[index];
        if(element.components["size"]!=undefined)
        {
            console.log(element.components["size"]);
        }
    }
}*/
// Tests ////////////////////////////////////////////////////////////////////////////////////
x=a.getContext`2d`;
x.fillStyle = 'rgb(200,0,0)';
x.fillRect(10,10,50,50);
setInterval(e=>{ update() },33);
let e = new ECS.Entity();
let e2 = new ECS.Entity();
e.addComponent(new ECS.Components.Size(10));
function update() {
    for (let index = 0; index < ECS.System.AllSystems.length; index++) {
        ECS.System.AllSystems[index].Execute();
    }
}
document.addEventListener('keydown', function(event) {
    if(event.keyCode == 37) {
        e.removeComponent("size");
    }
    else if(event.keyCode == 39) {
        e2.addComponent(new ECS.Components.Size(Math.random()));
    }
});