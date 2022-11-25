import sys
import click
# from .speaker import speaker_diarization
import speaker
import word_and_timeline
# from .word_and_timeline import word_derializer


@click.group()
def cli():
    """command packager"""
    pass

@click.command()
@click.option('-a', '--audio', prompt='Your audio path', help='Your audio path')
def show_speaker(audio):
    """Show speaker information"""
    click.echo(speaker.speaker_diarization(audio))

@click.command()
@click.option('-a', '--audio', prompt='Your audio path', help='Your audio path')
def show_words(audio):
    """Show each word spoken"""
    click.echo(word_and_timeline.word_derializer(audio))


if __name__=='__main__':
    cli.add_command(show_speaker)
    cli.add_command(show_words)
    cli()
