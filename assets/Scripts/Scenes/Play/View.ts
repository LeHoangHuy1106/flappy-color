import { _decorator, Component, Node, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('View')
export class View extends Component {
    @property(Label) txtQuestion: Label;
    @property(Label) txtScore: Label;
    @property(Node) gameOver: Node;

    public SetQuestion(n: string) {
        this.txtQuestion.string = n.toString();
    }

    public SetScore(n: number) {
        this.txtScore.string = n.toString();
    }
    public GameOver() {
        this.gameOver.active = true;
    }
}


