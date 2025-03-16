class Knight {
    constructor(x, y, moveBackwards = false) {
        this.xPos = x;
        this.yPos = y;
        this.step = 0;
        this.moveBackwards = moveBackwards;
        this.stepSpeed = 0.1;
        this.f = 0;
        this.arrayPos = moveBackwards ? enemyTroops.length : playerTroops.length;
        this.minX = x - 30;
        this.maxX = x + 30;
        this.delta = moveBackwards ? -1 : 1;
		this.range = 0;
		this.hp=300;
		this.attack=60;
		this.nextAttackTime=1000;
		this.attackTime=1300;
		this.attacking=false;
		this.reward=650;
    }

    draw() {
        const { xPos, yPos, step, delta } = this;

        // === Dinosaur ===
        ctx.strokeStyle = "orange";

        // Body
        ctx.beginPath();
        ctx.moveTo(xPos - 30, yPos);
        ctx.lineTo(xPos + 30, yPos);
        ctx.stroke();

        // Neck and head
        ctx.beginPath();
        ctx.moveTo(xPos + 10 * delta, yPos);
        ctx.lineTo(xPos + 15 * delta, yPos - 15);
        ctx.lineTo(xPos + 20 * delta, yPos - 15);
        ctx.stroke();

        // Legs (alternating motion for walking)
        const legOffset = Math.sin(step) * 5;
        ctx.beginPath();
        ctx.moveTo(xPos - 20, yPos);
        ctx.lineTo(xPos - 20, yPos + 15 + legOffset);
        ctx.moveTo(xPos - 10, yPos);
        ctx.lineTo(xPos - 10, yPos + 15 - legOffset);
        ctx.moveTo(xPos + 10, yPos);
        ctx.lineTo(xPos + 10, yPos + 15 + legOffset);
        ctx.moveTo(xPos + 20, yPos);
        ctx.lineTo(xPos + 20, yPos + 15 - legOffset);
        ctx.stroke();

        // Tail
        ctx.beginPath();
        ctx.moveTo(xPos - 30, yPos);
        ctx.lineTo(xPos - 40, yPos + 5);
        ctx.stroke();

        // === Stick Figure ===
        ctx.strokeStyle = "black";

        // Head
        ctx.beginPath();
        ctx.arc(xPos, yPos - 25, 5, 0, Math.PI * 2);
        ctx.stroke();

        // Body
        ctx.beginPath();
        ctx.moveTo(xPos, yPos - 20);
        ctx.lineTo(xPos, yPos - 5);
        ctx.stroke();

        // Arms
        ctx.beginPath();
        ctx.moveTo(xPos, yPos - 18);
        ctx.lineTo(xPos - 5 * delta, yPos - 15); // Left arm holding reins
        ctx.moveTo(xPos, yPos - 18);
        ctx.lineTo(xPos + 10 * delta, yPos - 25); // Right arm holding spear
        ctx.stroke();

        // Legs (bent as if sitting)
        ctx.beginPath();
        ctx.moveTo(xPos, yPos - 5);
        ctx.lineTo(xPos - 5 * delta, yPos + 5);
        ctx.moveTo(xPos, yPos - 5);
        ctx.lineTo(xPos + 5 * delta, yPos + 5);
        ctx.stroke();

        // === Spear ===
        ctx.strokeStyle = "brown";
        ctx.beginPath();
        ctx.moveTo(xPos + 10 * delta, yPos - 25);
        ctx.lineTo(xPos + 30 * delta, yPos - 35);
        ctx.stroke();

        // Spearhead
        ctx.fillStyle = "gray";
        ctx.beginPath();
        ctx.moveTo(xPos + 30 * delta, yPos - 35);
        ctx.lineTo(xPos + 32 * delta, yPos - 40);
        ctx.lineTo(xPos + 28 * delta, yPos - 40);
        ctx.closePath();
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
