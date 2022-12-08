"""
SchemaTree and Frame class creates a data structure for every frame in such a 
way that every frame can be given all neccessary factors/attributes as it moves through
filters and functions in the video generation pipeline

The SchemaTree class intanciates each frame like so depending on amount of speakers

frame = {
    "frame_id" :
        {
            "A":{
                    "words":"Stuff like this",
                    "other": "Timestanp and others will follow suite"
            },
            
            "B":{
                "Words":"Words like this"
            }
    }
}   

And the Frame class recives a dictionary (most likely a result of the SchemaTree Instance)
of keys/speaker number and attributes to update or delete, depending on the method

for example update, attribute = {
    speaker_num : {attribute_keyword: attribute_value} 
}

for example delete, attribute = {
    speaker_num : attribute_keyword
}
for example pop(), returns the first item from the frame dict and removes it from that frame dict 
"""
       


class Frames:
    def __init__(self, frame: dict) -> None:
        self.frame = frame
        for key, value in self.frame.items():
            self.frame_id = key 
    
    def insert(self, speaker: int, attribute: dict) -> dict:
        for item in self.frame[self.frame_id]:
            speaker_obj = self.frame[self.frame_id]
            if item == speaker:
                speaker_obj[speaker].update(attribute)
                    
        return self.frame
    
    def update(self, updates: dict) -> dict:
        for key, value in updates.items():
            speaker = key
            attribute = value
            for a, b in attribute.items():
                attribute_key = a
                attribute_value = b
                for item in self.frame[self.frame_id]:
                    speaker_obj = self.frame[self.frame_id]
                    speaker_obj[speaker][attribute_key] = attribute_value
        
        return  self.frame

    def delete(self, deletes: dict) -> dict:
        for key, value in deletes.items():
            speaker = key
            attribute_key = value
            speaker_obj = self.frame[self.frame_id]
            del speaker_obj[speaker][attribute_key]
        return self.frame
        
    def pop(self) -> dict:
        result = []
        for key, value in self.frame[self.frame_id].items():
            result.append({key:value})
        new_frame = result[0]
        result.remove(result[0])
        return 
    
    

class SchemaTree:
    
    def __init__(self, frame_id: int, number_of_speakers: int) -> None:
        self.frame_id =frame_id
        schema = {frame_id:{}}
        for num in range(number_of_speakers):
            schema[frame_id].update({num+1:{}})
        self.schema = schema
        
        
    def insert_frame_attribute(self, attribute: dict ) -> dict:
        for item, value in attribute.items():
            speaker = item
            attribute = value
            new_schema = Frames(self.schema).insert(speaker, attribute)
        return new_schema
        
    # Wount be needing this anymore 
    # def update_frame_attribute(self, speaker: int, attribute_key: str, attribute_value: str) -> list:
    #     new_schema = Frames(self.schema).update(speaker, attribute_key, attribute_value)
    #     return new_schema
    
    
    # def delete_frame_attribute(self, attribute_key: str):
    #     new_schema = Frames(self.schema).delete(speaker, attribute_key)
    #     return new_schema
        
            
    # def pop(self) -> dict:
    #     popped_node = self.nodelist[0]
    #     self.nodelist.remove(popped_node)
    #     print(self.nodelist)
    #     return popped_node



"""
Use the following lines to test how the classes work ...uncomment the print statements
third = 3
speakers = 2
attributes = {
    2: {"word": "Goodday to you dear viewer"}
}
attributes_update = {
    1:{"word":"howdy"}
}
attributes_delete = {
    1:"word"
}


conversation = SchemaTree(third, speakers)
# print(conversation.schema)
x = conversation.insert_frame_attribute(attributes)
# print(x)
result = Frames(x).update(attributes_update)
# print(result)
pop_result = Frames(result).pop()
# print(pop_result)
delete_result = Frames(result).delete(attributes_delete)
# print(delete_result)
"""