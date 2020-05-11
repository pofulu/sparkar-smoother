//––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– CONFIG

const SMOOTH_KEYWORD = '-s';
const FACE_KEYWORD = 'face';

const IGNORE_ROTATION_KEYWORD = '-noR';

const EYE_LEFT_KEYWORD = 'eyeL';
const EYEBOW_LEFT_KEYWORD = 'eyebowL';
const EYE_RIGHT_KEYWORD = 'eyeR';
const EYEBOW_RIGHT_KEYWORD = 'eyebowR';
const MOUTH_UPPERLIP_KEYWORD = 'mouthlipU';
const MOUTH_LOWERLIP_KEYWORD = 'mouthlipD';
const MOUTH_KEYWORD = 'mouth';
const EYELID_LEFT_UPPER_KEYWORD = 'eyelidLU';
const EYELID_RIGHT_UPPER_KEYWORD = 'eyelidRU';
const EYE_LEFT_OUTSIDE_CORNER_KEYWORD = 'eyeLOC';
const EYE_RIGHT_OUTSIDE_CORNER_KEYWORD = 'eyeROC';
const FOREHEAD_TOP_KEYWORD = 'foreheadT';
const MOUTH_LEFT_CORNER_KEYWORD = 'mouthLC';
const MOUTH_RIGHT_CORNER_KEYWORD = 'mouthRC';

function onTracked(targetRoot) {
    targetRoot.hidden = false;
}

function onLostTracked(targetRoot) {
    targetRoot.hidden = true;
}

//–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

const Scene = require('Scene');
const FaceTracking = require('FaceTracking');
const Reactive = require('Reactive');
const Diagnostics = require('Diagnostics');

const camera = Scene.root.findFirst('Camera');
const targets = Scene.root.findByPath(`**/*${FACE_KEYWORD}*${SMOOTH_KEYWORD}*`);

let isEnable = false;

const FacialFeatures = {
    leftUpperEyelidCenter: 'leftUpperEyelidCenter',
    leftEyebrowTop: 'leftEyebrowTop',
    leftEyeCenter: 'leftEyeCenter',
    leftOutsideCorner: 'leftEyeOutsideCorner',

    rightUpperEyelidCenter: 'rightUpperEyelidCenter',
    rightEyebrowTop: 'rightEyebrowTop',
    rightEyeCenter: 'rightEyeCenter',
    rightOutsideCorner: 'rightEyeOutsideCorner',

    mouthLowerLipCenter: 'mouthLowerLipCenter',
    mouthUpperLipCenter: 'mouthUpperLipCenter',
    mouthCenter: 'mouthCenter',
    mouthLeftCorner: 'mouthLeftCorner',
    mouthRightCorner: 'mouthRightCorner',
    
    foreheadTop: 'foreheadTop',
};

//–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

function parseFacialFeatureName(name) {
    if (name.indexOf(EYE_LEFT_KEYWORD) !== -1) return FacialFeatures.leftEyeCenter;
    else if (name.indexOf(EYE_RIGHT_KEYWORD) !== -1) return FacialFeatures.rightEyeCenter;
    else if (name.indexOf(EYEBOW_LEFT_KEYWORD) !== -1) return FacialFeatures.leftEyebrowTop;
    else if (name.indexOf(EYEBOW_RIGHT_KEYWORD) !== -1) return FacialFeatures.rightEyebrowTop;

    else if (name.indexOf(MOUTH_RIGHT_CORNER_KEYWORD) !== -1) return FacialFeatures.mouthRightCorner;
    else if (name.indexOf(MOUTH_LEFT_CORNER_KEYWORD) !== -1) return FacialFeatures.mouthLeftCorner;
    else if (name.indexOf(MOUTH_UPPERLIP_KEYWORD) !== -1) return FacialFeatures.mouthUpperLipCenter;
    else if (name.indexOf(MOUTH_LOWERLIP_KEYWORD) !== -1) return FacialFeatures.mouthLowerLipCenter;
    else if (name.indexOf(MOUTH_KEYWORD) !== -1) return FacialFeatures.mouthCenter;
    
    else if (name.indexOf(EYELID_LEFT_UPPER_KEYWORD) !== -1) return FacialFeatures.leftUpperEyelidCenter;
    else if (name.indexOf(EYELID_RIGHT_UPPER_KEYWORD) !== -1) return FacialFeatures.rightUpperEyelidCenter;
    else if (name.indexOf(EYE_LEFT_OUTSIDE_CORNER_KEYWORD) !== -1) return FacialFeatures.leftOutsideCorner;
    else if (name.indexOf(EYE_RIGHT_OUTSIDE_CORNER_KEYWORD) !== -1) return FacialFeatures.rightOutsideCorner;
    else if (name.indexOf(FOREHEAD_TOP_KEYWORD) !== -1) return FacialFeatures.foreheadTop;
  
    else return undefined;
}

function getTrackerPosition(tracker, feature) {
    switch (feature) {
        case FacialFeatures.leftEyebrowTop:
            return Reactive.pack3(
                tracker.cameraTransform.applyTo(tracker.leftEyebrow.top).x,
                tracker.cameraTransform.applyTo(tracker.leftEyebrow.top).y,
                tracker.cameraTransform.applyTo(tracker.leftEyebrow.top).z,
            );

        case FacialFeatures.rightEyebrowTop:
            return Reactive.pack3(
                tracker.cameraTransform.applyTo(tracker.rightEyebrow.top).x,
                tracker.cameraTransform.applyTo(tracker.rightEyebrow.top).y,
                tracker.cameraTransform.applyTo(tracker.rightEyebrow.top).z,
            );

        case FacialFeatures.leftEyeCenter:
            return Reactive.pack3(
                tracker.cameraTransform.applyTo(tracker.leftEye.center).x,
                tracker.cameraTransform.applyTo(tracker.leftEye.center).y,
                tracker.cameraTransform.applyTo(tracker.leftEye.center).z,
            );

        case FacialFeatures.rightEyeCenter:
            return Reactive.pack3(
                tracker.cameraTransform.applyTo(tracker.rightEye.center).x,
                tracker.cameraTransform.applyTo(tracker.rightEye.center).y,
                tracker.cameraTransform.applyTo(tracker.rightEye.center).z,
            );

        case FacialFeatures.mouthLowerLipCenter:
            return Reactive.pack3(
                tracker.cameraTransform.applyTo(tracker.mouth.lowerLipCenter).x,
                tracker.cameraTransform.applyTo(tracker.mouth.lowerLipCenter).y,
                tracker.cameraTransform.applyTo(tracker.mouth.lowerLipCenter).z,
            );

        case FacialFeatures.mouthUpperLipCenter:
            return Reactive.pack3(
                tracker.cameraTransform.applyTo(tracker.mouth.upperLipCenter).x,
                tracker.cameraTransform.applyTo(tracker.mouth.upperLipCenter).y,
                tracker.cameraTransform.applyTo(tracker.mouth.upperLipCenter).z,
            );

        case FacialFeatures.mouthCenter:
            return Reactive.pack3(
                tracker.cameraTransform.applyTo(tracker.mouth.center).x,
                tracker.cameraTransform.applyTo(tracker.mouth.center).y,
                tracker.cameraTransform.applyTo(tracker.mouth.center).z,
            );

        case FacialFeatures.mouthLowerLipCenter:
            return Reactive.pack3(
                tracker.cameraTransform.applyTo(tracker.mouth.center).x,
                tracker.cameraTransform.applyTo(tracker.mouth.center).y,
                tracker.cameraTransform.applyTo(tracker.mouth.center).z,
            );

        case FacialFeatures.leftUpperEyelidCenter:
            return Reactive.pack3(
                tracker.cameraTransform.applyTo(tracker.leftEye.upperEyelidCenter).x,
                tracker.cameraTransform.applyTo(tracker.leftEye.upperEyelidCenter).y,
                tracker.cameraTransform.applyTo(tracker.leftEye.upperEyelidCenter).z,
            );

        case FacialFeatures.rightUpperEyelidCenter:
            return Reactive.pack3(
                tracker.cameraTransform.applyTo(tracker.rightEye.upperEyelidCenter).x,
                tracker.cameraTransform.applyTo(tracker.rightEye.upperEyelidCenter).y,
                tracker.cameraTransform.applyTo(tracker.rightEye.upperEyelidCenter).z,
            );

        case FacialFeatures.leftOutsideCorner:
            return Reactive.pack3(
                tracker.cameraTransform.applyTo(tracker.leftEye.outsideCorner).x,
                tracker.cameraTransform.applyTo(tracker.leftEye.outsideCorner).y,
                tracker.cameraTransform.applyTo(tracker.leftEye.outsideCorner).z,
            );

        case FacialFeatures.rightOutsideCorner:
            return Reactive.pack3(
                tracker.cameraTransform.applyTo(tracker.rightEye.outsideCorner).x,
                tracker.cameraTransform.applyTo(tracker.rightEye.outsideCorner).y,
                tracker.cameraTransform.applyTo(tracker.rightEye.outsideCorner).z,
            );

        case FacialFeatures.foreheadTop:
            return Reactive.pack3(
                tracker.cameraTransform.applyTo(tracker.forehead.top).x,
                tracker.cameraTransform.applyTo(tracker.forehead.top).y,
                tracker.cameraTransform.applyTo(tracker.forehead.top).z,
            );

        case FacialFeatures.mouthLeftCorner:
            return Reactive.pack3(
                tracker.cameraTransform.applyTo(tracker.mouth.leftCorner).x,
                tracker.cameraTransform.applyTo(tracker.mouth.leftCorner).y,
                tracker.cameraTransform.applyTo(tracker.mouth.leftCorner).z,
            );

        case FacialFeatures.mouthRightCorner:
            return Reactive.pack3(
                tracker.cameraTransform.applyTo(tracker.mouth.rightCorner).x,
                tracker.cameraTransform.applyTo(tracker.mouth.rightCorner).y,
                tracker.cameraTransform.applyTo(tracker.mouth.rightCorner).z,
            );

        default:
            return Reactive.pack3(
                tracker.cameraTransform.x,
                tracker.cameraTransform.y,
                tracker.cameraTransform.z,
            );
    }
}

function smoothFollowTracker(tracker, target, smooth = 100, enableRotation = true, facialFeature) {
    return camera.then(result => {
        let trackerPosition = getTrackerPosition(tracker, facialFeature);
        trackerPosition = Reactive.pack3(
            trackerPosition.x.expSmooth(smooth),
            trackerPosition.y.expSmooth(smooth),
            trackerPosition.z.expSmooth(smooth).add(result.focalPlane.distance)
        );

        target.transform.position = trackerPosition;

        if (enableRotation) {
            const faceRotation = Reactive.pack3(
                tracker.cameraTransform.rotationX.expSmooth(smooth),
                tracker.cameraTransform.rotationY.expSmooth(smooth),
                tracker.cameraTransform.rotationZ.expSmooth(smooth)
            );
            target.transform.rotationX = faceRotation.x;
            target.transform.rotationY = faceRotation.y;
            target.transform.rotationZ = faceRotation.z;
        }
    })
}

//––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– Method

/**
 * @returns {Promise<void>}
 */
function enable() {
    if (isEnable) return;
    isEnable = true;

    return targets.then(all => Promise.all([
        all.map(target => {
            const indexOfFaceKeyword = target.name.indexOf(FACE_KEYWORD);
            const faceKeywordLength = FACE_KEYWORD.length;
            let faceIndex = target.name.substring(indexOfFaceKeyword + faceKeywordLength, indexOfFaceKeyword + faceKeywordLength + 1);
            faceIndex = parseInt(faceIndex);

            const indexOfSmoothKeyword = target.name.indexOf(SMOOTH_KEYWORD);
            const smoothKeywordLength = SMOOTH_KEYWORD.length;
            let smooth = target.name.substring(indexOfSmoothKeyword + smoothKeywordLength);
            smooth = parseInt(smooth);

            const tracker = FaceTracking.face(faceIndex);
            tracker.isTracked.onOn({ fireOnInitialValue: true }).subscribe(() => onTracked(target));
            tracker.isTracked.onOff({ fireOnInitialValue: true }).subscribe(() => onLostTracked(target));

            const enableRotation = target.name.indexOf(IGNORE_ROTATION_KEYWORD) === -1;

            return smoothFollowTracker(tracker, target, smooth, enableRotation, parseFacialFeatureName(target.name));
        })
    ]));
}

/**
 * @returns {Promise<void>}
 */
function disable() {
    if (!isEnable) return;
    isEnable = false;

    return targets.then(
        all => Promise.all(all.map(
            target => Promise.all([
                onSetSignalThen(target.transform.x, () => target.transform.x = target.transform.x.pinLastValue()),
                onSetSignalThen(target.transform.y, () => target.transform.y = target.transform.y.pinLastValue()),
                onSetSignalThen(target.transform.z, () => target.transform.z = target.transform.z.pinLastValue()),
                onSetSignalThen(target.transform.rotationX, () => target.transform.rotationX = target.transform.rotationX.pinLastValue()),
                onSetSignalThen(target.transform.rotationY, () => target.transform.rotationY = target.transform.rotationY.pinLastValue()),
                onSetSignalThen(target.transform.rotationZ, () => target.transform.rotationZ = target.transform.rotationZ.pinLastValue()),
            ])
        ))
    );
}

module.exports = new class SmoothModule {
    constructor() {
        enable();
    }

    get enable() {
        return isEnable;
    }

    set enable(value) {
        if (value) {
            enable();
        } else {
            disable();
        }
    }

    logTrackedObjectNames() {
        return targets.then(results => Diagnostics.log(results.map(i => i.name)));
    }

    logFacialFeatureKeywords() {
        return Diagnostics.log(Object.getOwnPropertyNames(FacialFeatures));
    }
}

//––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– Utilities

function onSetSignalThen(signal, callback = () => { }) {
    return invokeOnceThen(signal.monitor({ 'fireOnInitialValue': true }).select('newValue'), callback);
}

function invokeOnceThen(eventSource, call) {
    return new Promise(resolve => {
        invokeOnce(eventSource, i => {
            call(i);
            resolve(i);
        })
    })
}

function invokeOnce(eventSource, call) {
    const once = eventSource.subscribe(any => {
        once.unsubscribe();
        call(any);
    });

    return once;
}