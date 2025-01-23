import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-logo',
    standalone: true,
    templateUrl: './logo.component.html',
    styleUrls: ['./logo.component.css'],
})
export class LogoComponent implements OnInit {
    texts = ['Welcome!', 'Ra-V.dev'];
    characterSet = 'ABCDEFGHIJKLMNOPQRSTUVXYZbfghijknpqstuwxyz0123456789@#$%^&*(),{}+<>';
    currentTextIndex = 0;
    activeText: string[] = [];
    scrambleInterval = 50;
    revealInterval = 200;
    isDecoding = false;

    ngOnInit(): void {
        this.initializeScramble();
        this.runAnimation();
    }

    initializeScramble(): void {
        const target = this.texts[this.currentTextIndex];
        this.activeText = Array.from({ length: target.length }, () => this.getRandomChar());
        this.updateText();
    }

    runAnimation(): void {
        this.scrambleCharacters();
        this.decodeCharacters();
    }

    decodeCharacters(): void {
        this.isDecoding = true;
        const target = this.texts[this.currentTextIndex];
        let delay = 0;

        target.split('').forEach((char, index) => {
            delay += index === 0 ? 2 * this.revealInterval : this.revealInterval;

            setTimeout(() => {
                this.activeText[index] = char;
                this.updateCharacter(index, char, 'green');

                if (index === target.length - 1) {
                    this.isDecoding = false;
                    if (this.currentTextIndex === 0) {
                        setTimeout(() => this.fadeToNeutralColor(), 2000);
                    } else if (this.currentTextIndex < this.texts.length - 1) {
                        setTimeout(() => this.switchToNextText(), 2000);
                    }
                }
            }, delay);
        });
    }

    scrambleCharacters(): void {
        const interval = setInterval(() => {
            this.activeText = this.activeText.map((char, index) => {
                if (!this.isCharacterRevealed(index)) {
                    const randomChar = this.getRandomChar();
                    this.updateCharacter(index, randomChar, 'rgb(50, 50, 50)');
                    return randomChar;
                }
                return char;
            });

            if (!this.isDecoding) clearInterval(interval);
        }, this.scrambleInterval);
    }

    fadeToNeutralColor(): void {
        this.activeText.forEach((_, index) => {
            const element = this.getCharacterElement(index);
            if (element) {
                element.style.transition = 'color 500ms ease-in-out';
                element.style.color = 'rgb(50, 50, 50)';
            }
        });
        setTimeout(() => this.switchToNextText(), 1000);
    }

    switchToNextText(): void {
        this.currentTextIndex++;
        this.initializeScramble();
        this.runAnimation();
    }

    getRandomChar(): string {
        return this.characterSet.charAt(Math.floor(Math.random() * this.characterSet.length));
    }

    isCharacterRevealed(index: number): boolean {
        return this.activeText[index] === this.texts[this.currentTextIndex][index];
    }

    updateCharacter(index: number, char: string, color: string): void {
        const element = this.getCharacterElement(index);
        if (element) {
            element.textContent = char;
            element.style.color = color;
        }
    }

    updateText(): void {
        const container = document.getElementById('animated-logo');
        if (container) {
            container.innerHTML = this.activeText
                .map((char, index) => `<span id="char-${index}" style="color: rgb(50, 50, 50); font-family: 'VT323', monospace;">${char}</span>`)
                .join('');
        }
    }

    getCharacterElement(index: number): HTMLElement | null {
        return document.getElementById(`char-${index}`);
    }

    getLogoElement(): HTMLElement | null {
        return document.getElementById('animated-logo');
    }
}
