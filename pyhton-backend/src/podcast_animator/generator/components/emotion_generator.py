import text2emotion as te
import re
import nltk
# from ------nameoffile------ import -----nameofsentence-----
# sentence = ----nameofsentence----



def removing_not(sentence):
    '''h
    Takes in a sentence, replaces negative worlds
    Args:
        sentence - original sentence
    Returns:
        refined_sentence - sentence without negatives
                           (to get accurate emotion from it)
    '''
    d = {'not sad': 'happy', 'not bad': 'happy', 'not boring': 'happy', 'not wrong': 'happy', 'not bored': 'happy',
         'not jealous': 'happy', 'not happy': 'sad', 'not well': 'sad', 'not suitable': 'angry', 'not right': 'angry',
         'not good': 'sad', 'not excited': 'angry', 'not funny ': 'sad', 'not  kind': 'sad', 'not proud': 'angry',
         'not cool': 'angry', 'not funny': 'angry', 'not kind': 'angry', 'not open': 'angry', 'not safe': 'Fear',
         'not enough': 'Empty', 'not know': 'sad', 'not knowing': 'sad', 'not believe': 'angry',
         'not believing': 'angry',
         'not understand': 'sad', 'not understanding': 'sad', 'no doubt': 'happy', 'not think': 'sad',
         'not thinking': 'sad',
         'not recognise': 'sad', 'not recognising': 'sad', 'not forget': 'angry', 'not forgetting': 'angry',
         'not remember': 'sad',
         'not remembering': 'sad', 'not imagine': 'sad', 'not imagining': 'sad', 'not mean': 'sad',
         'not meaning': 'sad',
         'not agree': 'angry', 'not agreeing': 'sad', 'not disagree': 'happy', 'not disagreeing': 'happy',
         'not deny': 'sad',
         'not denying': 'sad', 'not promise': 'angry', 'not promising': 'angry', 'not satisfy': 'sad',
         'not satisfying': 'sad',
         'not realise': 'sad', 'not realising': 'sad', 'not appear': 'angry', 'not appearing': 'angry',
         'not please': 'sad', 'not pleasing': 'sad', 'not impress': 'sad', 'not impressing': 'sad',
         'not surprise': 'sad', 'not surprising': 'sad', 'not concern': 'sad', 'not concerning': 'sad',
         'not have': 'sad', 'not having': 'sad',
         'not own': 'sad', 'not owning': 'sad', 'not possess': 'sad', 'not possessing': 'sad', 'not lack': 'sad',
         'not lacking': 'sad',
         'not consist': 'sad', 'not consisting': 'sad', 'not involve': 'sad', 'not involving': 'sad',
         'not include': 'sad', 'not including': 'sad', 'not contain': 'sad',
         'not containing': 'sad', 'not love': 'sad', 'not like': 'angry',
         'not hate': 'happy', 'not hating': 'happy', 'not adore': 'sad', 'not adoring': 'sad', 'not prefer': 'sad',
         'not preferring': 'sad', 'not care': 'angry', 'not mind': 'angry', 'not minding': 'sad',
         'not want': 'angry', 'not wanting': 'sad',
         'not need': 'angry', 'not needing': 'angry', 'not desire': 'sad', 'not desiring': 'sad', 'not wish': 'sad',
         'not wishing': 'sad', 'not hope': 'sad', 'not hoping': 'sad', 'not appreciate': 'sad',
         'not appreciating': 'sad',
         'not value': 'sad', 'not valuing': 'sad', 'not owe': 'sad', 'not owing': 'sad', 'not seem': 'sad',
         'not seeming': 'sad', 'not fit': 'sad', 'not fitting': 'sad', 'not depend': 'sad',
         'not depending': 'sad', 'not matter': 'sad', 'not afford': 'sad', 'not affording': 'sad', 'not aim': 'sad',
         'not aiming': 'sad', 'not attempt': 'angry', 'not attempting': 'angry', 'not ask': 'angry',
         'not asking': 'angry', 'not arrange': 'angry', 'not arranging': 'angry', 'not beg': 'angry',
         'not begging': 'angry', 'not begin': 'angry', 'not beginning': 'angry', 'not caring': 'angry',
         'not choose': 'angry', 'not choosing': 'angry', 'not claim': 'angry', 'not claiming': 'angry',
         'not consent': 'angry', 'not consenting': 'angry', 'not continue': 'angry', 'not continuing': 'angry',
         'not dare': 'angry', 'not daring': 'angry', 'not decide': 'sad',
         'not deciding': 'sad', 'not demand': 'angry', 'not demanding': 'angry', 'not deserve': 'angry',
         'not deserving': 'angry', 'not expect': 'angry',
         'not expecting': 'angry', 'not fail': 'happy', 'not failing': 'happy', 'not get': 'sad', 'not getting': 'sad',
         'not hesitate': 'sad', 'not hesitating': 'sad', 'not hurry': 'happy', 'not hurrying': 'happy',
         'not intend': 'sad', 'not intending': 'sad', 'not learn': 'angry', 'not learning': 'angry',
         'not liking': 'angry', 'not loving': 'sad', 'not manage': 'angry',
         'not managing': 'angry', 'not neglect': 'sad', 'not neglecting': 'sad', 'not offer': 'angry',
         'not offering': 'angry',
         'not plan': 'angry', 'not planing': 'angry', 'not prepare': 'angry',
         'not preparing': 'angry', 'not pretend': 'angry', 'not pretending': 'angry', 'not proceed': 'angry',
         'not proceeding': 'angry',
         'not propose': 'angry', 'not proposing': 'sad', 'not refuse': 'sad', 'not refusing': 'sad',
         'not start': 'sad',
         'not starting': 'sad', 'not stop': 'happy', 'not stopping': 'happy', 'not struggle': 'angry',
         'not struggling': 'angry',
         'not swear': 'angry', 'not swearing': 'angry', 'not threaten': 'happy', 'not threatening': 'happy',
         'not try': 'angry', 'not trying': 'angry', 'not volunteer': 'angry',
         'not volunteering': 'angry', 'not wait': 'angry', 'not waiting': 'angry', 'not feel': 'sad',
         'not feeling': 'sad', "not able": "sad", "not do": "sad"}

    f = re.findall("not\s\w+", sentence)
    for i in f:
        try:
            refined_sentence = sentence.replace(i, d[i])
        except:
            pass
    refined_sentence = sentence.lower()
    return refined_sentence


    
def accurate_emotions(emotion):
    '''
    Gets key with highest value of emotion
    Args:
        emotion - dictionary of emotions
    Returns:
        final_emotion - list of emotion(s) to determine image
    '''
    final_emotion = []
    for key, val in emotion.items():
            if val==1:
                final_emotion.append(key)
            else:
                key = 'neutral'
                final_emotion.append(key)
                
    return final_emotion



def read_sentence_emotions(refined_sentence):
    '''
    Picks sentence, gets a dictionary of emotions from it
    Args:
        refined_sentence - sentence we work on
    Returns:
        emotion - dictionary of emotions
    '''
    try:
        emotion = te.get_emotion(removing_not(refined_sentence))
    except LookupError:
        nltk.download('omw-1.4')
        nltk.download('averaged_perceptron_tagger')
        emotion = te.get_emotion(removing_not(refined_sentence))
    return accurate_emotions(emotion)