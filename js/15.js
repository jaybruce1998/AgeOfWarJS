class WarMachine {
    constructor(x, y, moveBackwards) {
        this.xPos = x;
        this.yPos = y;
        this.step = 0;
        this.moveBackwards = moveBackwards;
        this.stepSpeed = 0.1;
        this.f = 0;
        this.arrayPos = moveBackwards ? enemyTroops.length : playerTroops.length;
        this.minX = x - 40;
        this.maxX = x + 40;
        this.delta = moveBackwards ? -1 : 1;
		this.range = 0;
		this.hp=3000;
		this.attack=600;
		this.nextAttackTime=1000;
		this.attackTime=2250;
		this.attacking=false;
		this.reward=26000;
	}

    draw() {
        const { xPos, yPos, step } = this;

        // === Purple Tank Body ===
        ctx.fillStyle = "purple";
        ctx.beginPath();
        ctx.rect(xPos - 30, yPos - 20, 60, 40); // Main tank body
        ctx.fill();
        ctx.stroke();

        // === Tank Tracks ===
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.rect(xPos - 30, yPos + 20, 20, 10); // Left track
        ctx.rect(xPos + 10, yPos + 20, 20, 10); // Right track
        ctx.fill();
        ctx.stroke();

        // === Tank Turret ===
        ctx.fillStyle = "darkpurple";
        ctx.beginPath();
        ctx.rect(xPos - 10, yPos - 30, 20, 20); // Turret
        ctx.fill();
        ctx.stroke();

        // === Tank Cannon ===
        ctx.strokeStyle = "black";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(xPos, yPos - 30); // Cannon start from turret
        ctx.lineTo(xPos + 40*this.delta, yPos - 30); // Cannon extends outward
        ctx.stroke();

        // === Tank Movement ===
        const trackMove = Math.sin(step) * 2; // Track movement effect
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.rect(xPos - 30 + trackMove, yPos + 20, 20, 10); // Left track movement
        ctx.rect(xPos + 10 + trackMove, yPos + 20, 20, 10); // Right track movement
        ctx.fill();
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