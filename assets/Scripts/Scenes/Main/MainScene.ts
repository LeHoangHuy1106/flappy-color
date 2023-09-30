import { _decorator, Component, Node, director, Constraint, Label, sys } from 'cc';
import { AudioController, ClipSound } from '../../Extention/AudioController';
import { Constants } from '../../Extention/Constants';
import { DataManager } from '../../Extention/DataManager';
import { Loading } from '../../Extention/Loading';
const { ccclass, property } = _decorator;

@ccclass('MainScene')
export class MainScene extends Component {

    @property(Label) txtScore: Label;
    @property(Loading) loading: Loading;
    @property(AudioController) audio: AudioController;
    public SetScore(n: number) {
        this.txtScore.string = n.toString();
    }
    onLoad() {
        let highScore = parseInt(sys.localStorage.getItem(Constants.highScore)) || 0;
        let score = DataManager.getInstance().GetData(Constants.score, 0);


        if (score > highScore) {
            highScore = score;
            sys.localStorage.setItem(Constants.highScore, score.toString());
        }
        this.SetScore(highScore)
    }
    public PlayGame(): void {
        this.audio.PlaySound(ClipSound.button);
        this.loading.LoadScene(Constants.scenePlay, 0.5)
    }
}


