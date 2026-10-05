import { useActionSound } from '../../../hooks';
import { Skill } from '../../../types';

interface Props {
  skill: Skill;
  handleSkillPreview?: (skill: Skill) => void;
  className?: string;
}

const SkillIcon = ({ skill, handleSkillPreview, className }: Props) => {
  const { playPreviewSound } = useActionSound();

  const fireSkillPreviewHandler = (e: React.MouseEvent) => {
    if (handleSkillPreview) {
      e.stopPropagation();
      playPreviewSound();
      handleSkillPreview(skill);
    }
  };

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${
        className || 'w-10 h-10'
      }`}
    >
      <img
        src={skill.image}
        alt={skill.name}
        className="w-full h-full object-contain filter drop-shadow"
        onClick={handleSkillPreview ? fireSkillPreviewHandler : undefined}
      />
    </div>
  );
};

export default SkillIcon;
