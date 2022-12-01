from __future__ import division
import re
from g2p_en import G2p


def word(texts):
    #use the g2p_en library to transcribe text
    g2p = G2p()
    for text in texts:
        out = g2p(text)
        #print(out)
        #print(out[0])

        def remove(out):
            pattern = '[0-9]'
            output = [re.sub(pattern, '', i) for i in out]
            return output
        #Output = remove(out)
        #print(Output)

    #segment list based on the stress levels into sub list    
    primary_stress = []
    secondary_stress = []
    no_stress = []

    for x in out:
        if '1' in x:
            n = x
            primary_stress.append(n)        
        elif '2' in x:
            s = x
            secondary_stress.append(s)
        elif len(x)==2:
            v = x
            secondary_stress.append(v)
        else:
            p = x
            no_stress.append(p)

    #sub list length
    pstress = len(primary_stress)
    sstress = len(secondary_stress)
    nstress = len(no_stress)


    #ration formula for determining stress length
    if sstress != 0:
        no_round = round((2/9), 2)
        secondary_round = round((3/9), 2) + 0.01
        primary_round = round((4/9), 2)
    else:
        no_round = round((3/7), 2)
        primary_round = round((4/7), 2)

    try:
        if sstress != 0:
            sstress_ratio = secondary_round/sstress
        else:
            secondary_round/sstress
            raise ZeroDivisionError
    except Exception as e:
        sstress_ratio = 0

    try:
        if pstress != 0:
            pstress_ratio = primary_round/pstress
        else:
            primary_round/pstress
            raise ZeroDivisionError
    except Exception as e:
        pstress_ratio = 0


    try:
        if nstress != 0:
            nstress_ratio = no_round/nstress
        else:
            no_round/nstress
            raise ZeroDivisionError
    except Exception as e:
        nstress_ratio = 0

    #return jail, jail2, jail3
        
    #generate phoneme, phoneme_ratio 
    def st(lis):
        li_word=''
        for i in lis:
            li_word += ''+ i
        return li_word
    
    phon = []
    for y in out:
        if '1' in y:
            pstress1 = y
            word = remove(pstress1)
            pstress1 = st(word), pstress_ratio
            phon.append(pstress1)    
        elif '2' in y:
            sstress1 = y
            word = remove(sstress1)
            sstress1 = st(word), sstress_ratio
            phon.append(sstress1) 
        elif len(y)==2:
            sstress1 = y
            word = remove(sstress1)
            sstress1 = st(word), sstress_ratio
            phon.append(sstress1)
        else:
            nstress1 = y
            word = remove(nstress1)
            nstress1 = st(word), nstress_ratio
            phon.append(nstress1)
        
    return phon

        
#input required text in to texts = [' ']
def main():
    texts = ['position']
    phon_ratio = word(texts)
    print(phon_ratio)

if __name__ == '__main__':
    main()