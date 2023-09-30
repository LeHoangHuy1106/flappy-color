import { _decorator, Component, Node, input, EventTouch, Input, Prefab, Vec3, math, tween, random, director, RigidBody2D, v2, Collider2D, IPhysics2DContact, Contact2DType, Vec2, sys, view } from 'cc';
import { AudioController, ClipSound } from '../../Extention/AudioController';
import { Constants } from '../../Extention/Constants';
import { DataManager } from '../../Extention/DataManager';
import { Extention } from '../../Extention/Extention';
import { Loading } from '../../Extention/Loading';
import { NodeCustom } from '../../Extention/NodeCustom';
import { ObjectPool } from '../../Extention/ObjectPool';
import { View } from './View';

const { ccclass, property } = _decorator;

@ccclass('Controller')
export class Controller extends Component {


    @property(View) view: View;
    @property(Prefab) circle: Prefab;
    @property(Node) parentCircle: Node;
    @property(Loading) loading: Loading;
    @property(AudioController) audio: AudioController;

    private width: number;
    private height: number;
    private score: number = 0;
    private isClose = false;


    onLoad(): void {
        this.score = 0;
        const screenSize = view.getVisibleSize()
        this.width = screenSize.width;
        this.height = screenSize.height;
        DataManager.getInstance().SetData(Constants.score, this.score);
        ObjectPool.Instance.CreateListObject(Constants.circle, this.circle, 15, this.parentCircle)


    }
    start() {
        this.CreateQuestion()
    }

    CreateQuestion() {
        let math = this.CreateMath(Math.floor(this.score / 5) + 2)
        this.view.SetQuestion(math.problem);
        DataManager.getInstance().SetData(Constants.answer, math.answer);

        let count = 0;
        const maxCalls = 4;
        const listAnswers = this.RandomListAnswer(math.answer)

        const intervalId = setInterval(() => {

            let g = ObjectPool.Instance.getObject(Constants.circle);
            if (g) {
                if (this.isClose) { return }
                g.SetPositon(this.RandomPostion());
                let taget = new Vec3(g.GetPositon().x - this.width - 100, g.GetPositon().y)
                g.Moving(taget, 15);
                g.GetNode().active = true;
                g.SetAnswer(listAnswers[count]);
                count++;

                if (count >= maxCalls) {
                    clearInterval(intervalId); // Dừng interval sau khi gọi đủ lần
                }
            }
        }, Extention.RandomFloatInRange(2000, 3000));

    }

    update(dt: number): void {
        if (this.isClose) {
            return;
        }
        if (DataManager.getInstance().GetData(Constants.score, 0) <= -1) {
            this.view.GameOver();
            this.isClose = false;
            this.audio.PlaySound(ClipSound.over);
            DataManager.getInstance().SetData(Constants.score, this.score);
            this.scheduleOnce(() => this.loading.LoadScene(Constants.mainScene, 0.5), 2)
        }
        else {

            if (DataManager.getInstance().GetData(Constants.score, 0) != this.score) {
                if (DataManager.getInstance().GetData(Constants.score, 0) > this.score) {
                    this.audio.PlaySound(ClipSound.narmal);
                }
                else {
                    this.audio.PlaySound(ClipSound.wrong);
                }
                this.score = DataManager.getInstance().GetData(Constants.score, 0);
                this.view.SetScore(this.score);
                this.CreateQuestion();

            }
        }
    }

    arrayIncludes(arr: number[], num: number): boolean {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === num) {
                return true;
            }
        }
        return false;
    }

    RandomListAnswer(n: number): number[] {
        const result: number[] = [n];

        // Kiểm tra nếu n là số thực
        if (!Number.isInteger(n)) {
            n = parseFloat(n.toFixed(2)); // Làm tròn n thành số thực với 2 số thập phân
            while (result.length < 4) {
                const randomNumber = n + Math.random();
                if (!this.arrayIncludes(result, parseFloat(randomNumber.toFixed(2)))) {
                    result.push(randomNumber);
                }
            }
        }
        else {
            while (result.length < 4) {
                const randomNumber = n + Math.floor(Math.random() * 21) - 10;
                if (!this.arrayIncludes(result, randomNumber)) {
                    result.push(randomNumber);
                }
            }
        }
        // Nếu n là số nguyên, random trong khoảng 10

        return result.sort(() => Math.random() - 0.5);
    }

    CreateMath(numOperands: number): { problem: string, answer: number } {
        if (numOperands < 2) {
            throw new Error("Số lượng phần tử phải lớn hơn hoặc bằng 2.");
        }

        const operands: number[] = [];
        const operators: string[] = ['+', '-', '*', '/'];

        // Tạo ngẫu nhiên các số
        for (let i = 0; i < numOperands; i++) {
            operands.push(Math.floor(Math.random() * 10) + 1); // Số nguyên từ 1 đến 10
        }

        // Tạo ngẫu nhiên các phép toán
        const problemParts: string[] = [];
        for (let i = 0; i < numOperands - 1; i++) {
            problemParts.push(operands[i].toString());
            problemParts.push(operators[Math.floor(Math.random() * operators.length)]);
        }
        problemParts.push(operands[numOperands - 1].toString());

        const problem: string = problemParts.join(' ');
        const answer: number = eval(problem); // Tính toán kết quả

        // Làm tròn kết quả đến 2 chữ số thập phân
        const roundedAnswer: number = parseFloat(answer.toFixed(2));

        return { problem, answer: roundedAnswer };
    }



    private RandomPostion(): Vec3 {
        let x = this.width / 2 + 100;
        let y = Extention.RandomFloatInRange(-this.height / 2 + 100, this.height / 2 - 100);
        return new Vec3(x, y, 0);
    }





}


