class SuperSoldier {
    constructor(x, y, moveBackwards) {
        this.xPos = x;
        this.yPos = y;
        this.step = 0;
        this.moveBackwards = moveBackwards;
        this.stepSpeed = 0.1;
        this.f = 0;
        this.arrayPos = moveBackwards ? enemyTroops.length : playerTroops.length;
        this.minX = x - 10;
        this.maxX = x + 10;
        this.delta = moveBackwards ? -1 : 1;
		this.range = 130;
		this.hp=4000;
		this.attack=400;
		this.nextAttackTime=1000;
		this.attackTime=320;
		this.attacking=false;
		this.reward=195000;
    }

    draw() {
        const { xPos, yPos, step, delta } = this;
		const armOffset=drawMan(xPos, yPos, step);
		let gradient = ctx.createLinearGradient(xPos - 20, yPos - 40, xPos + 20, yPos + 20);
		gradient.addColorStop(0, "red");
		gradient.addColorStop(0.14, "orange");
		gradient.addColorStop(0.28, "yellow");
		gradient.addColorStop(0.42, "green");
		gradient.addColorStop(0.57, "blue");
		gradient.addColorStop(0.71, "indigo");
		gradient.addColorStop(0.85, "violet");
		gradient.addColorStop(1, "red");
		
		ctx.fillStyle = gradient;
        ctx.beginPath();
		ctx.arc(xPos, yPos - 30, 10, 0, Math.PI * 2);
        ctx.fill();
		
        // === Musket ===
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(this.xPos + 10*this.delta, this.yPos - 25 + armOffset * this.delta); // From hand
        ctx.lineTo(this.xPos + 35*this.delta, this.yPos - 20 + armOffset * this.delta); // Musket barrel
        ctx.stroke();
        
        // Musket Stock
        ctx.beginPath();
        ctx.moveTo(this.xPos + 10*this.delta, this.yPos - 25 + armOffset * this.delta); // Starting point of musket
        ctx.lineTo(this.xPos + 10*this.delta, this.yPos -20 + armOffset * this.delta); // Stock end
        ctx.stroke();

        ctx.lineWidth = 1; // Reset stroke width
    }
	
    canMove() {
        return this.moveBackwards
            ? playerTroops.length === 0
                ? true
                : this.arrayPos === 0
                    ? this.minX > playerTroops[0].maxX
                    : this.minX > enemyTroops[this.arrayPos - 1].maxX
            : this.arrayPos === 0
                ? enemyTroops.length === 0
                    ? true
                    : this.maxX < enemyTroops[0].minX
                : this.maxX < playerTroops[this.arrayPos - 1].minX;
    }

    update() {
        if (this.f++ % 3 === 0) {
            this.step += this.stepSpeed;
            if(canMove(this.moveBackwards, this.arrayPos, this.minX, this.maxX)) {
                this.xPos += this.delta;
                this.minX += this.delta;
                this.maxX += this.delta;
				if(this.range==0)
				{
					this.attacking=false;
					return;
				}
				if(!this.attacking)
				{
					if(canAttack(this.moveBackwards, this.minX, this.maxX, this.range))
					{
						this.nextAttackTime=Date.now()+this.attackTime;
						this.attacking=true;
					}
					return;
				}
				if(Date.now()>=this.nextAttackTime)
				{
					this.attacking=false;
					const x=this.moveBackwards?this.minX:this.maxX;
					bullets.push(new Bullet(x, this.yPos, x+this.range*this.delta, this.yPos, this.attack));
				}
            }
			else if(this.arrayPos==0)
			{
				if(!this.attacking)
				{
					this.nextAttackTime=Date.now()+this.attackTime;
					this.attacking=true;
					return;
				}
				if(Date.now()>=this.nextAttackTime)
				{
					this.attacking=false;
					if(this.moveBackwards)
						if(playerTroops.length>0)
						{
							playerTroops[0].hp-=this.attack;
							xp+=Math.round(killCheck(playerTroops)/2);
							document.getElementById("xp").innerHTML=xp;
						}
						else
							base1hp-=this.attack;
					else if(enemyTroops.length>0)
					{
						enemyTroops[0].hp-=this.attack;
						const r=killCheck(enemyTroops);
						if(r>0)
						{
							cash+=r;
							xp+=r+r;
							document.getElementById("cash").innerHTML=cash;
							document.getElementById("xp").innerHTML=xp;
						}
					}
					else
						base2hp-=this.attack;
				}
			}
			else if(this.range>0)
			{
				if(!this.attacking)
				{
					if(canAttack(this.moveBackwards, this.minX, this.maxX, this.range))
					{
						this.nextAttackTime=Date.now()+this.attackTime;
						this.attacking=true;
					}
					return;
				}
				if(Date.now()>=this.nextAttackTime)
				{
					this.attacking=false;
					const x=this.moveBackwards?this.minX:this.maxX;
					bullets.push(new Bullet(x, this.yPos, x+this.range*this.delta, this.yPos, this.attack));
				}
			}
        }
    }
}