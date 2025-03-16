class SlingshotMan {
    constructor(x, y, moveBackwards = false) {
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
		this.range = 100;
		this.hp=42;
		this.attack=10;
		this.nextAttackTime=1000;
		this.attackTime=800;
		this.attacking=false;
		this.reward=33;
    }

    draw() {
        const { xPos, yPos, step, delta } = this;
        const armOffset = drawMan(xPos, yPos, step);

        // Slingshot frame
        ctx.beginPath();
        ctx.moveTo(xPos + 10 * delta, yPos - 20 + armOffset * delta);
        ctx.lineTo(xPos + 20 * delta, yPos - 30 + armOffset * delta);
        ctx.lineTo(xPos + 30 * delta, yPos - 20 + armOffset * delta);
        ctx.stroke();

        // Slingshot rubber bands
        ctx.beginPath();
        ctx.moveTo(xPos + 20 * delta, yPos - 30 + armOffset * delta);
        ctx.lineTo(xPos + 25 * delta, yPos - 35 + armOffset * delta);
        ctx.moveTo(xPos + 30 * delta, yPos - 20 + armOffset * delta);
        ctx.lineTo(xPos + 25 * delta, yPos - 35 + armOffset * delta);
        ctx.strokeStyle = "red";
        ctx.stroke();
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
