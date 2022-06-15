import {Injectable} from "@angular/core";
import {ReplaySubject} from "rxjs";
import {SessionEditorArgs} from "../session-editor/session-editor.component.service";
import {SessionDay} from "../../models";

export class SessionDayArgs {
  sessionDay: SessionDay
}

@Injectable({
  providedIn: 'root'
})
export class SessionDayComponentService {
  onShow: ReplaySubject<SessionEditorArgs> = new ReplaySubject<SessionDayArgs>(1);
  onClose: ReplaySubject<void> = new ReplaySubject<void>(1);

  showEditor(args: SessionEditorArgs) {
    this.onShow.next(args);
  }

  closeEditor() {
    this.onClose.next();
  }
}
