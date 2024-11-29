from transformers import BartForConditionalGeneration, BartTokenizer, Trainer, TrainingArguments
from torch.utils.data import Dataset, DataLoader
import pandas as pd

model_name = 'facebook/bart-large-cnn'
tokenizer = BartTokenizer.from_pretrained(model_name)
model = BartForConditionalGeneration.from_pretrained(model_name)

data = pd.read_csv(r'../Final Merged Database CSV.csv')

class SummarizationDataset(Dataset):
    def __init__(self, tokenizer, data, max_input_length=1024, max_target_length=128):
        self.tokenizer = tokenizer
        self.data = data
        self.max_input_length = max_input_length
        self.max_target_length = max_target_length

    def __len__(self):
        return len(self.data)

    def __getitem__(self, index):
        item = self.data.iloc[index]
        input_text = item['Scraped Content']
        target_text = item['Summarized Content']

        inputs = self.tokenizer(
            input_text,
            max_length=self.max_input_length,
            padding="max_length",
            truncation=True,
            return_tensors="pt"
        )
        targets = self.tokenizer(
            target_text,
            max_length=self.max_target_length,
            padding="max_length",
            truncation=True,
            return_tensors="pt"
        )

        return {
            "input_ids": inputs["input_ids"].squeeze(),
            "attention_mask": inputs["attention_mask"].squeeze(),
            "labels": targets["input_ids"].squeeze()
        }
        
dataset = SummarizationDataset(tokenizer, data)

training_args = TrainingArguments(
    output_dir="./results",
    evaluation_strategy="no",
    learning_rate=5e-5,
    per_device_train_batch_size=4,
    per_device_eval_batch_size=4,
    num_train_epochs=3,
    weight_decay=0.01,
    save_total_limit=2,
    save_steps=500,
    remove_unused_columns=False,
    logging_dir="./logs",
    logging_steps=100,
    report_to="none"  
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=dataset,
    tokenizer=tokenizer
)

trainer.train()

model.save_pretrained("./fine_tuned_bart")
tokenizer.save_pretrained("./fine_tuned_bart")