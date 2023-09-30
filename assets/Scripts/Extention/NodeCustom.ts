import { _decorator, Component, Node, RigidBody2D, Collider2D, UITransform, Vec2, Size, tween, Vec3, Tween, view, Rect, BoxCollider2D, v2, IPhysics2DContact, Contact2DType, find, random, Label, Button } from 'cc';
import { Constants } from './Constants';
import { DataManager } from './DataManager';
import { Extention } from './Extention';
const { ccclass, property } = _decorator;

@ccclass('NodeCustom')
export class NodeCustom extends Component {


    private tweenMoving;
    private answer: Label
    private value: number;
    private btn: Button;
    onEnable(): void {

    }
    onLoad(): void {
        const screenSize = view.getVisibleSize()
        this.tweenMoving = tween(this.node)
        this.btn = this.getComponent(Button);
        this.SetEventValueInButton()
        this.answer = this.node.getComponentInChildren(Label);
    }
    public GetNode(): Node {
        return this.node;
    }

    public SetAnswer(n: number) {
        this.value = n;
        n = parseFloat(n.toFixed(2));
        if (this.answer) {
            this.answer.string = n.toString();
        }
        else {
            this.answer.string = "null";
        }
    }


    public SetPositon(pos: Vec3) {
        this.node.position = pos;
    }
    public GetPositon(): Vec3 {
        return this.node.position;
    }

    public Moving(target: Vec3, time: number): void {
        this.tweenMoving.to(time, { position: target }).start();
        setTimeout(() => {

            if (this.node) {
                if (this.value === DataManager.getInstance().GetData(Constants.answer, null)) {

                    DataManager.getInstance().SetData(Constants.score, -1)
                }
                this.node.active = false
            }

        }, time * 1000)

    }

    private SetEventValueInButton() {
        this.btn.node.on('click', () => {
            if (this.value === DataManager.getInstance().GetData(Constants.answer, null)) {
                let score = DataManager.getInstance().GetData(Constants.score, 0) + 1;
                DataManager.getInstance().SetData(Constants.score, score)
                this.EffectCorrect()

            }
            else {
                let score = DataManager.getInstance().GetData(Constants.score, 0) - 1;
                DataManager.getInstance().SetData(Constants.score, score)

            }

        }, this);

    }
    private EffectCorrect() {
        this.node.active = false;
    }




}


